
import React, { useEffect, useRef, useState } from 'react';
import styles from "./search.module.scss"

interface SearchBarProps {
  location: google.maps.LatLng | undefined;
  setLocation: (location: google.maps.LatLng | undefined) => void;
  placesLibrary: google.maps.PlacesLibrary | null;
  map: google.maps.Map | undefined;
  initialValue: string;
  zoom: number;
}

const Search: React.FC<SearchBarProps> = ({ location, setLocation, placesLibrary, map, initialValue, zoom }) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {

    // Wait until the input is mounted and then create the autocomplete instance.
    if (inputRef.current && placesLibrary !== null && map !== undefined) {
      const autocomplete = new placesLibrary.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'name'],
      });

      // Event listener when a place is selected.
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          setSearchValue('');
          return;
        }

        // Set the map to the selected place's location.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
          map.setZoom(zoom);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(zoom);
        }

        // Update the location state.
        setLocation(place.geometry.location);
        setSearchValue(place.name || place.formatted_address || '');
      });
    }
  }, [placesLibrary, map, zoom, setLocation]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
      <main className={styles.inputField}>
          <input 
              type="text" 
              ref={inputRef} 
              value={searchValue} 
              onChange={handleInputChange} 
              className={styles.searchInput}
              placeholder=''
          />
          <span>Search an Address</span>
      </main>
  )
}

export default Search
