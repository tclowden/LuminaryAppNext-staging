'use client';
import React, { useEffect, useRef, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng, Suggestion } from 'react-places-autocomplete';
import GoogleMapReact from 'google-map-react';
import Input from '../input/Input';
import AddressOptionSelector from './(partials)/AddressOptionSelector';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch } from '../../../store/hooks';
import { setAddToast } from '../../../store/slices/toast';

type Coords = { lat: number; lng: number };
type MapTypes = 'HYBRID' | 'ROADMAP' | 'SATELLITE' | 'TERRAIN';
export type AddressDetails = {
   state: string;
   city: string;
   zipCode: string;
   streetAddress: string;
   latLng: Coords;
   addressVerified: boolean;
};

interface Props {
   defaultLatLng?: Coords;
   onAddressSelect: (addressDetails?: AddressDetails) => void;
   addressDetails?: AddressDetails;

   // all option props
   defaultShowOptions?: boolean;
   hideOptions?: boolean;

   // all map props
   showMap?: boolean;
   showMapWhenAddressSelected?: boolean;
   mapType?: MapTypes;
   draggable?: boolean;
   showMarker?: boolean;
   draggableMarker?: boolean;
   showMapTypeControls?: boolean;
   fullScreenControl?: boolean;
   zoomControl?: boolean;
   defaultZoom?: number;
   zoom?: number;
   mapMaxWidth?: number;
   mapMaxHeight?: number;
}

const InputAddress = ({
   defaultLatLng = { lat: 1, lng: 1 },
   onAddressSelect,
   addressDetails,
   defaultShowOptions = false,
   hideOptions = false,
   showMap = true,
   showMapWhenAddressSelected = false,
   showMarker = true,
   draggable = false,
   draggableMarker = true,
   showMapTypeControls = true,
   mapType = 'HYBRID',
   fullScreenControl = true,
   defaultZoom = 5,
   zoom = 25,
   zoomControl = true,
   mapMaxWidth,
   mapMaxHeight,
}: Props) => {
   const dispatch = useAppDispatch();

   const addressInputRef = useRef<any>();

   const [inputVal, setInputVal] = useState<string>(addressDetails?.streetAddress || '');
   const [mapObj, setMapObj] = useState<any>(null);
   const [marker, setMarker] = useState<any>(null);
   const [showOptions, setShowOptions] = useState<boolean>(defaultShowOptions);

   const handleSelect = (selectedAddress: string) => {
      geocodeByAddress(selectedAddress)
         .then(async (results: any) => {
            const addyComps = results[0].address_components;

            const streetNum = addyComps.find((comp: any) => comp.types.includes('street_number'));
            const streetName = addyComps.find((comp: any) => comp.types.includes('route'));

            const stateObj = addyComps.find((comp: any) => comp.types.includes('administrative_area_level_1'));
            const cityObj = addyComps.find((comp: any) => comp.types.includes('locality'));
            const zipcodeObj = addyComps.find((comp: any) => comp.types.includes('postal_code'));
            const latLng: Coords = await getLatLng(results[0]);
            return {
               latLng: latLng,
               state: stateObj?.long_name || 'N/A',
               city: cityObj?.long_name || 'N/A',
               zipCode: zipcodeObj?.long_name || 'N/A',
               // streetAddress: selectedAddress,
               streetAddress: `${streetNum?.long_name} ${streetName?.long_name}`,
               addressVerified: false,
            } as AddressDetails;
         })
         .then((addressDetails: AddressDetails) => {
            setInputVal(addressDetails.streetAddress);
            onAddressSelect(addressDetails);
         })
         .catch((err) => console.log('Error ', err));
   };

   const updateMapMarker = () => {
      if (!showMarker) return;
      const map = mapObj.map;
      const maps = mapObj.maps;
      if (marker) marker.setMap(null);
      let newMarker = new maps.Marker({
         position: addressDetails?.latLng,
         map,
         draggable: draggableMarker,
      });
      setMarker(newMarker);
   };

   useEffect(() => {
      if (mapObj && addressDetails) updateMapMarker();
   }, [addressDetails, mapObj]);

   useEffect(() => {
      if (marker && marker.draggable) {
         marker.addListener('mouseup', async () => {
            const newLatLng = marker.getPosition();
            const newAddressDetails: any = await new Promise((resolve, reject) => {
               // Create a geocoder instance
               var geocoder = new google.maps.Geocoder();
               // Reverse geocode the marker position
               geocoder.geocode({ location: newLatLng }, async (results: Array<any> | null, status: any) => {
                  if (status === 'OK') {
                     if (results && !!results?.length) {
                        // Get the formatted address
                        // var address = results[0].formatted_address;
                        const addyComps = results[0].address_components;

                        const streetNum = addyComps.find((comp: any) => comp.types.includes('street_number'));
                        const streetName = addyComps.find((comp: any) => comp.types.includes('route'));

                        const stateObj = addyComps.find((comp: any) =>
                           comp.types.includes('administrative_area_level_1')
                        );
                        const cityObj = addyComps.find((comp: any) => comp.types.includes('locality'));
                        const zipcodeObj = addyComps.find((comp: any) => comp.types.includes('postal_code'));
                        const latLng: Coords = await getLatLng(results[0]);
                        const newAddressDetails = {
                           latLng: latLng,
                           state: stateObj?.long_name || 'N/A',
                           city: cityObj?.long_name || 'N/A',
                           zipCode: zipcodeObj?.long_name || 'N/A',
                           // streetAddress: address,
                           streetAddress: `${streetNum?.long_name} ${streetName?.long_name}`,
                           addressVerified: false,
                        } as AddressDetails;

                        setInputVal(newAddressDetails.streetAddress);
                        resolve(newAddressDetails);
                     } else {
                        console.log('No results found');
                        resolve(null);
                     }
                  } else {
                     console.log('Geocoder failed due to: ' + status);
                     reject('Geocoder failed due to: ' + status);
                  }
               });
            }).catch((err) => {
               console.log('err:', err);
            });

            onAddressSelect(newAddressDetails);
         });
      } else if (marker && !marker.draggable) {
         marker.addListener('mouseup', () => {
            console.log('address is verified... so no dragging the marker');
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: "Can't move the marker once address is verified." }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
      }
   }, [marker]);

   const handleGoogleMapApiLoaded = ({ map, maps }: any) => {
      setMapObj({ map, maps });
      const MAP_TYPE = mapType ? mapType.toLowerCase() : 'hybrid';
      map.setMapTypeId(MAP_TYPE);
   };

   return (
      <>
         <PlacesAutocomplete
            value={inputVal}
            onChange={(value: string) => {
               setInputVal(value);
            }}
            onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }: any) => {
               return (
                  <div className='relative'>
                     <Input
                        ref={addressInputRef}
                        iconName='MagnifyingGlass'
                        placeholder={'Enter address'}
                        onFocus={() => setShowOptions(true)}
                        {...getInputProps()}
                     />
                     <AddressOptionSelector
                        options={suggestions}
                        getOptionItemProps={getSuggestionItemProps}
                        showOptions={defaultShowOptions || !!(suggestions?.length && showOptions && !hideOptions)}
                        setShowOptions={(bool: boolean) => {
                           setShowOptions(bool);
                        }}
                        siblingRef={addressInputRef}
                     />
                  </div>
               );
            }}
         </PlacesAutocomplete>
         {showMap && (
            <div
               className={twMerge(`
                  my-0 mx-auto relative h-[240px] w-full
               `)}
               style={{
                  ...(mapMaxWidth && { maxWidth: mapMaxWidth }),
                  ...(mapMaxHeight && { maxHeight: mapMaxHeight }),
               }}>
               {showMapWhenAddressSelected && !addressDetails && (
                  <div className='absolute'>Type and select and address for the map to show...</div>
               )}
               <GoogleMapReact
                  style={{
                     width: '100%',
                     height: '100%',
                     visibility:
                        (showMapWhenAddressSelected && addressDetails) || !showMapWhenAddressSelected
                           ? 'visible'
                           : 'hidden',
                  }}
                  options={{
                     mapTypeControl: showMapTypeControls,
                     fullscreenControl: fullScreenControl,
                     zoomControl: zoomControl,
                  }}
                  draggable={draggable}
                  defaultCenter={addressDetails?.latLng ?? defaultLatLng}
                  center={addressDetails?.latLng}
                  zoom={inputVal?.length || addressDetails ? zoom : defaultZoom}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }: any) => handleGoogleMapApiLoaded({ map, maps })}
               />
            </div>
         )}
      </>
   );
};

export default InputAddress;
