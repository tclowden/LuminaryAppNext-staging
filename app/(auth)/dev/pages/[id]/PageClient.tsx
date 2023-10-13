'use client';
import { useRouter } from 'next/navigation';
import Button from '../../../../../common/components/button/Button';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../common/components/grid/Grid';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import { Page } from '../types';
import * as Yup from 'yup';
import useForm, { YupSchemaObject } from '../../../../../common/hooks/useForm';
import { camelCaseToTitleCase, findMinMaxValueInArray } from '../../../../../utilities/helpers';
import { useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import ToggleSwitch from '../../../../../common/components/toggle-switch/ToggleSwitch';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import LoadingBackdrop from '../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PagePermissions, { configurePagePermissions } from './(partials)/PagePermissions';
import ChildrenPages, { configureChildrenPages } from './(partials)/ChildrenPages';
import Modal from '../../../../../common/components/modal/Modal';

const stringifyPrettyPages = (pagesArr: Array<Page>) => {
   const recurse: any = (pagesArr: Array<Page>, parentPageName = null) => {
      let arr: Array<any> = [];
      for (let page of pagesArr) {
         let currentPageName: any = parentPageName ? `${parentPageName} - ${page.name}` : page.name;
         const pageType = !page?.parentPageId ? '(App)' : !page?.route && page.parentPageId ? '(Section)' : '(Page)';
         const obj = { name: currentPageName + ' ' + pageType, parentPageId: page.parentPageId, id: page.id };

         if (!!page?.sections?.length) {
            arr.push(obj);
            arr.push(...recurse(page.sections, currentPageName));
         } else {
            arr.push(obj);
         }
      }
      return arr;
   };
   return recurse(pagesArr);
};

const configurePageValidationSchema: YupSchemaObject<any> = {
   pageType: Yup.string().required('Page type is required'),
   name: Yup.string().required('Name is required'),
   iconName: Yup.string().when('pageType', {
      is: (pageType: any) => pageType && pageType === 'App',
      then: () => Yup.string().required('Icon name is required.'),
      otherwise: () => Yup.string().nullable(),
   }), // Only required if pageType 'App' is selected
   iconColor: Yup.string().when('pageType', {
      is: (pageType: any) => pageType && pageType === 'App',
      then: () => Yup.string().required('Icon color is required.'),
      otherwise: () => Yup.string().nullable(),
   }), // Only required if pageType 'App' is selected
   route: Yup.string().when('pageType', {
      is: (pageType: any) => pageType && pageType === 'Page Link',
      then: () => Yup.string().required('Route is required.'),
      otherwise: () => Yup.string().nullable(),
   }), // Only required if pageType 'Page Link' is selected
   showOnSidebar: Yup.boolean().required('Field is required'),
   parentPage: Yup.string().when('pageType', {
      is: (pageType: string) => pageType && pageType !== 'App',
      then: (schema: any) => Yup.object().required('Parent page is required'),
      otherwise: () => Yup.object().nullable(),
   }), // required on all pageTypes except 'App'
};

type Props = {
   allPages: Array<Page>;
   allPagesPretty: Array<Page>;
   pagePermissions: Array<any>;
   permissionTags: Array<any>;
   page: Page;
   colors: Array<any>;
   icons: Array<any>;
};

const PageClient = ({ allPages, allPagesPretty, page, colors, icons, pagePermissions, permissionTags }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [openScriptModal, setOpenScriptModal] = useState<boolean>(false);
   const [scriptResults, setScriptResults] = useState<string>('');

   const handlePageTypeSelect = (e: any, selectedPageType: string) => {
      handleChange({ target: { type: 'text', value: selectedPageType, name: 'pageType' } });
   };

   const handleColorSelect = (e: any, selectedColor: any) => {
      handleChange({ target: { type: 'text', value: selectedColor.iconConfig.color, name: 'iconColor' } });
   };

   const handleIconSelect = (e: any, selectedIcon: any) => {
      handleChange({ target: { type: 'text', value: selectedIcon.iconConfig.name, name: 'iconName' } });
   };

   const handleParentPageSelect = (e: any, selectedParentPage: Page) => {
      // if there is a change in parent... need to know for displayOrder configuration when going to save...
      // use the 'previousParentPage' & 'previousParentPageId' to compare when saving
      // and if we are in editMode
      if (selectedParentPage.id !== values?.parentPageId && values?.editMode) {
         setMultiValues({
            previousParentPage: values.parentPage,
            previousParentPageId: values.parentPageId,
         });
      }
      handleChange({ target: { type: 'text', value: selectedParentPage, name: 'parentPage' } });
      handleChange({ target: { type: 'text', value: selectedParentPage.id, name: 'parentPageId' } });
   };

   const handleSuccessToast = (message: string) => {
      dispatch(
         setAddToast({
            iconName: 'CheckMarkCircle',
            details: [{ label: 'Success', text: message }],
            variant: 'success',
            autoCloseDelay: 5,
         })
      );
   };

   const handleErrorToast = (message: string) => {
      dispatch(
         setAddToast({
            iconName: 'XMarkCircle',
            details: [{ label: 'Error', text: message }],
            variant: 'danger',
            autoCloseDelay: 5,
         })
      );
   };

   const handleSave = () => {
      setIsSaving(true);
      const newPageData = { ...values };

      // grab all the sibling pages to the current page being saved using the parentPageId
      let siblingPages;
      if (!newPageData.parentPageId) {
         siblingPages = allPages.filter((item) => !item.parentPageId);
      } else {
         siblingPages = allPages.filter((item) => item.parentPageId === newPageData.parentPageId);
      }

      // reset the displayOrder to not skip a number...
      if (!!newPageData?.childrenPages?.length) {
         newPageData.childrenPages = newPageData.childrenPages.map((childPage: any, i: number) => ({
            ...childPage,
            displayOrder: i + 1,
         }));
      }

      if (!!newPageData?.pagePermissions?.length) {
         newPageData.pagePermissions = newPageData.pagePermissions.map((permission: any, i: number) => {
            // make a copy
            const permissionCopy = { ...permission };
            // delete unneccessary data
            delete permissionCopy['actionsConfig'];
            delete permissionCopy['createPermissionAction'];
            delete permissionCopy['editMode'];

            // delete the tempId
            // tempId is only there to know if there are any created permissions,

            permissionCopy['isDefaultPermission'] =
               typeof permission?.isDefaultPermission === 'boolean' ? permission?.isDefaultPermission : false;
            // return data
            return { ...permissionCopy };
         });
      }

      // if there is no displayOrder... we are creating a page... so need to set a displayOrder
      // if there is a previousParentPageId... then parent has changed... must reset the displayOrder
      if (newPageData?.previousParentPageId || typeof newPageData?.displayOrder === 'undefined') {
         // grab the largest displayOrder between all this page's siblings
         const { max } = findMinMaxValueInArray(siblingPages, ['displayOrder']);
         newPageData['displayOrder'] = (max || 0) + 1;
      }

      // delete unneccesary key:values
      delete newPageData['previousParentPageId'];
      delete newPageData['previousParentPage'];
      delete newPageData['editMode'];
      // eventually, if we want to store type of page... we can use the pageType key:value inside the newPageData
      // for now, just delete
      delete newPageData['pageType'];

      if (newPageData?.id) {
         // fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages/${newPageData.id}`, {
         //    method: 'PUT',
         //    headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
         //    body: JSON.stringify(newPageData),
         // })
         // fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages/script/${newPageData.id}`, {
         fetch(`/api/v2/pages/script/${newPageData.id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(newPageData),
         })
            .then(async (res) => {
               const result = await res.json();
               console.log('result');
               if (result.error) throw new Error(result.error.errorMessage);
               setIsSaving(false);
               setScriptResults(result);
               setOpenScriptModal(true);
               // router.push('dev/pages?_');
               // handleSuccessToast('Page Was Updated');
            })
            .catch((err) => {
               console.error(err);
               setIsSaving(false);
               handleErrorToast('Could Not Update Page');
            });
      } else {
         // fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages`, {
         //    method: 'POST',
         //    headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
         //    body: JSON.stringify(newPageData),
         // })
         // fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages/script`, {
         fetch(`/api/v2/pages/script`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(newPageData),
         })
            .then(async (res) => {
               const results = await res.json();
               if (results.error) throw new Error(results.error.errorMessage);
               setIsSaving(false);
               setScriptResults(results);
               setOpenScriptModal(true);
               // router.push('dev/pages?_');
               // handleSuccessToast('New Page Created');
            })
            .catch((err) => {
               console.error('err:', err);
               setIsSaving(false);
               handleErrorToast('Page Was Not Created');
            });
      }
   };

   const { handleSubmit, handleChange, handleBlur, values, setMultiValues, errors } = useForm({
      initialValues: {
         ...page,
         ...(page?.id && {
            pageType:
               page?.parentPageId && page?.route ? 'Page Link' : page?.parentPageId && !page.route ? 'Section' : 'App',
            parentPage: [...allPages].find((pageItem) => pageItem.id === page?.parentPageId) || null,
         }),
         childrenPages: configureChildrenPages(
            allPages.filter((p: any) => page?.id === p?.parentPageId && p?.showOnSidebar)
         ),
         pagePermissions: configurePagePermissions(pagePermissions),
         editMode: !!page?.id ? true : false,
      },
      validationSchema: configurePageValidationSchema,
      onSubmit: handleSave,
   });

   const toReplace: any = {
      '<break>': '\n',
      '<break2>': '\n\n',
      '<tab>': '  ',
   };
   const formatterRegex = /<break>|<tab>|<break2>/g;

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit}>
                     Save
                  </Button>
                  <Button color='white' onClick={() => router.push(`/dev/pages`)}>
                     Cancel
                  </Button>
               </>
            }
            breadcrumbsTitle={page?.name}>
            <Grid>
               <Explainer title='Configure Page' description='Select a page type.'>
                  <Grid>
                     <Grid columnCount={2} responsive>
                        <DropDown
                           label={`Page Type ${values?.editMode ? '(Not Editable)' : ''}`}
                           name=''
                           placeholder='Select Page Type'
                           selectedValues={!!values?.pageType ? [values.pageType] : []}
                           options={['App', 'Section', 'Page Link']}
                           onOptionSelect={(e, selectedValue) => handlePageTypeSelect(e, selectedValue)}
                           errorMessage={errors?.pageType}
                           disabled={values?.editMode}
                        />
                     </Grid>
                  </Grid>
               </Explainer>

               {values?.pageType && (
                  <Explainer description='Configure your page with a name, icon, route, etc.'>
                     <Grid>
                        <Grid columnCount={2} responsive>
                           <Input
                              label={`${values?.pageType} Name`}
                              value={values.name || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={'name'}
                              placeholder={`Enter a${values?.pageType === 'App' ? 'n' : ''} ${values?.pageType} Name`}
                              required
                              errorMessage={errors?.name}
                           />
                           <ToggleSwitch
                              textOptions='yes/no'
                              checked={values?.showOnSidebar || false}
                              onChange={handleChange}
                              label='Show on Sidebar?'
                              name='showOnSidebar'
                              errorMessage={errors?.showOnSidebar}
                           />
                        </Grid>

                        {/* ICON CONFIG */}
                        <Grid columnCount={2} responsive>
                           <DropDown
                              searchable
                              label='Icon'
                              options={icons}
                              selectedValues={
                                 values?.iconName
                                    ? [
                                         {
                                            displayName: camelCaseToTitleCase(values.iconName),
                                            iconConfig: {
                                               name: values.iconName,
                                               color: values.iconColor || 'gray:400',
                                            },
                                         },
                                      ]
                                    : []
                              }
                              placeholder='Select Icon'
                              keyPath={['displayName']}
                              name='iconName'
                              onBlur={handleBlur}
                              onOptionSelect={handleIconSelect}
                              errorMessage={errors?.iconName}
                           />
                           {values?.pageType === 'App' && (
                              <DropDown
                                 label='Icon Color'
                                 options={colors}
                                 selectedValues={
                                    values?.iconColor
                                       ? [
                                            {
                                               displayName:
                                                  values.iconColor.charAt(0).toUpperCase() + values.iconColor.slice(1),
                                               iconConfig: { name: 'Rectangle', color: values.iconColor },
                                            },
                                         ]
                                       : []
                                 }
                                 placeholder='Select Icon Color'
                                 keyPath={['displayName']}
                                 name='iconColor'
                                 onBlur={handleBlur}
                                 onOptionSelect={handleColorSelect}
                                 errorMessage={errors?.iconColor}
                              />
                           )}
                        </Grid>

                        <Grid columnCount={2} responsive>
                           {values?.pageType !== 'App' && (
                              <DropDown
                                 searchable
                                 label='Parent Page'
                                 // options={allPages.filter((pageOption) => !pageOption.route)} // remove page links
                                 options={[...stringifyPrettyPages(allPagesPretty)]} // remove page links
                                 selectedValues={values?.parentPage ? stringifyPrettyPages([values?.parentPage]) : []}
                                 placeholder='Select Parent Page'
                                 keyPath={['name']}
                                 name='parentPage'
                                 onBlur={handleBlur}
                                 onOptionSelect={handleParentPageSelect}
                                 errorMessage={errors?.parentPage}
                              />
                           )}
                           {values?.pageType === 'Page Link' && (
                              <Input
                                 label='Route URL'
                                 value={values.route || ''}
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 name={'route'}
                                 placeholder='e.g. "admin/users"'
                                 required
                                 errorMessage={errors?.route}
                              />
                           )}
                        </Grid>
                     </Grid>
                  </Explainer>
               )}

               {values?.pageType && (values?.pageType === 'App' || values?.pageType === 'Section') && (
                  <ChildrenPages childrenPages={values?.childrenPages} setMultiValues={setMultiValues} />
               )}

               {/* Permissions for the page can be created here */}
               {values?.pageType && (
                  <PagePermissions
                     pagePermissions={values?.pagePermissions}
                     setMultiValues={setMultiValues}
                     permissionTags={permissionTags}
                  />
               )}
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
         <Modal
            isOpen={openScriptModal}
            primaryButtonCallback={(e: any) => {
               // copy to clipboard
               if (typeof scriptResults === 'string') {
                  navigator.clipboard.writeText(
                     scriptResults?.replace(formatterRegex, (m: any) => toReplace[m]).replace('*indent*', '   ')
                  );
                  dispatch(
                     setAddToast({
                        iconName: 'CheckMarkCircle',
                        details: [{ label: 'Success', text: 'Code copied to clipboard!' }],
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }
            }}
            primaryButtonText={'Copy To Clipboard'}
            onClose={(e: any) => {
               console.log('closing');
               setOpenScriptModal(false);
               setScriptResults('');
            }}
            title={'Code To Copy'}>
            <Grid>
               {/* <div>Copy Code Below</div> */}
               <div className='whitespace-pre bg-lum-gray-50 py-4 px-6 rounded'>
                  <div className='text-[12px] italic bg-lum-gray-50 max-h-[60vh] overflow-y-auto text-lum-orange-800 overflow-x-scroll'>
                     {typeof scriptResults === 'string' &&
                        scriptResults?.replace(formatterRegex, (m: any) => toReplace[m]).replace('*indent*', '   ')}
                  </div>
               </div>
            </Grid>
         </Modal>
      </>
   );
};

export default PageClient;
