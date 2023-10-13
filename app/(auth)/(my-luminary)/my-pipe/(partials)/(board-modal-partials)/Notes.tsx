'use client';
import Image from 'next/image';
import Hr from '../../../../../../common/components/hr/Hr';
import defaultImageSrc from '../../../../../../public/assets/images/profile.jpg';
import ScrollContainer from './ScrollContainer';
import TableCellContentEditable from '@/common/components/table-cell-content-editable/TableCellContentEditable';

interface Props {
   leadData: any;
   show: boolean;
}

const Notes = ({ leadData, show }: Props) => {
   return (
      <>
         {show && (
            <ScrollContainer
               scrollBehavior={'auto'}
               className={'max-h-[350px] overflow-y-auto px-4 py-1 flex flex-col gap-[10px]'}>
               {[...leadData?.notes]?.map((note: any, i: number) => {
                  return (
                     <div
                        key={i}
                        className={`bg-lum-white dark:bg-lum-gray-700 rounded dark:shadow-lum-gray-800 shadow px-4`}>
                        <div className='note-head flex flex-row items-center justify-between py-1'>
                           <div className='flex flex-row items-center gap-y-2 py-2'>
                              <div className='relative h-[28px] w-[28px]'>
                                 <Image
                                    className='rounded-full cursor-pointer'
                                    src={note?.createdBy?.profileUrl || defaultImageSrc}
                                    alt='Profile Image'
                                    // width={24}
                                    fill
                                    style={{
                                       objectFit: 'cover',
                                    }}
                                    // height={24}
                                 />
                              </div>
                              <div className='text-[14px] text-lum-gray-700 dark:text-lum-white ml-2'>
                                 {note?.createdBy?.fullName || ''}
                              </div>
                           </div>
                           <div className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {note?.createdAtPretty || 'N/A'}
                           </div>
                        </div>

                        <Hr className='border-t-[.5px] border-t-lum-gray-100 -ml-[16px] w-[calc(100%+32px)]' />
                        <div className='note-body py-4 text-[14px] text-lum-gray-700 dark:text-lum-white'>
                           {/* {note?.content} */}
                           <TableCellContentEditable content={note?.content} />
                        </div>
                     </div>
                  );
               })}
            </ScrollContainer>
         )}
      </>
   );
};

export default Notes;
