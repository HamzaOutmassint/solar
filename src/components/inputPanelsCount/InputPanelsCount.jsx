// import React, { useState } from 'react';
// import { SolarPanelConfig } from '../../types/solar';
import { Sun } from 'lucide-react';

const SolarPanelCount = ({ solarPanelConfigs }) => {
//   const [configId, setConfigId] = useState(0);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setConfigId(parseInt(event.target.value, 10));
//   };

  return (
    <div>
      {/* <table className="table-auto w-full body-medium secondary-text">
        <tr>
          <td className="primary-text"><md-icon>solar_power</md-icon></td>
          <th className="pl-2 text-left">Panels count</th>
          <td className="pl-2 text-right">
            <span>{solarPanelConfigs[configId].panelsCount} panels</span>
          </td>
        </tr>
      </table> */}
      <div className=''>
        <div>
            <Sun />
            <span>Panels count</span>
        </div>
        <div>
            250 panels
        </div>
      </div>

      <input type="range" min="0" max="200" value="100" />
    </div>
  );
};

export default SolarPanelCount;
