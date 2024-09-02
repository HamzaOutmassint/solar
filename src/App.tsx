import * as GMAPILoader from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import "./App.scss";
import Search from './components/search/Search';
import { ExternalLink } from 'lucide-react';

const { Loader } = GMAPILoader;

const googleMapsApiKey : string = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;

const defaultPlace = {
  name: 'Rinconada Library',
  address: '1213 Newell Rd, Palo Alto, CA 94303',
};
const zoom = 19;

function App() {
  const [location, setLocation] = useState<google.maps.LatLng | undefined>(undefined);
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [geometryLibrary, setGeometryLibrary] = useState<google.maps.GeometryLibrary | null>(null);
  const [placesLibrary, setPlacesLibrary] = useState<google.maps.PlacesLibrary | null>(null);

  const mapElement = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const initMap = async () => {
      // Load Google Maps libraries.
      const loader = new Loader({ apiKey : googleMapsApiKey });
      const libraries = {
        geometry: loader.importLibrary('geometry'),
        maps: loader.importLibrary('maps'),
        places: loader.importLibrary('places'),
      };
      const geometry  = await libraries.geometry;
      const mapsLibrary : google.maps.MapsLibrary = await libraries.maps;
      const places = await libraries.places;

      setGeometryLibrary(geometry)
      setPlacesLibrary(places)

      // Get the address information for the default location.
      const geocoder = new google.maps.Geocoder();
      const geocoderResponse = await geocoder.geocode({
        address: defaultPlace.address,
      });
      const geocoderResult = geocoderResponse.results[0];

      // Initialize the map at the desired location.
      const location = geocoderResult.geometry.location;
      setLocation(location);

      if (mapElement.current) {
        const mapInstance = new mapsLibrary.Map(mapElement.current, {
          center: location,
          zoom: zoom,
          tilt: 0,
          mapTypeId: 'satellite',
          mapTypeControl: false,
          fullscreenControl: false,
          rotateControl: false,
          streetViewControl: false,
          zoomControl: false,
        });
        setMap(mapInstance);
      }
    };

    initMap();
  }, []);
  

  return (
    <div className="appContainer">
      <div className="appContainer__map" ref={mapElement} />

      <aside className="appContainer__sidebar">
        <Search 
          placesLibrary={placesLibrary}
          location={location}
          setLocation={setLocation}
          map={map}
          initialValue={defaultPlace.name}
        />

        <div className='appContainer__sidebar-description'>
          <a
            className="primary-text"
            href="https://developers.google.com/maps/documentation/solar/overview?hl=en"
            target="_blank" rel="noreferrer"
          >
            Two distinct endpoints of the <span>Solar API <ExternalLink size={15} /> </span>
          </a>
          offer many benefits to solar marketplace websites, solar installers, and solar SaaS designers.
          <p>Click on an area below to see what type of information the Solar API can provide.</p>
        </div>
      </aside>
    </div>
  )
}

export default App;
