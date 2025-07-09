'use client';

import { useState, useCallback } from 'react';
import { theme } from '@/config/theme';
import { FiSearch, FiX, FiGrid } from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';

interface IconSelectorProps {
  selectedIcon?: string;
  onSelect: (iconName: string) => void;
  className?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Only Font Awesome icons
const iconCategories = {
  'Font Awesome': FaIcons,
};

// Popular Font Awesome icons for quick access
const popularIcons = [
  // Basic & Navigation
  'FaHome', 'FaUser', 'FaUsers', 'FaCog', 'FaSearch', 'FaBars', 'FaTimes',
  'FaArrowLeft', 'FaArrowRight', 'FaArrowUp', 'FaArrowDown', 'FaChevronLeft', 'FaChevronRight',

  // Communication & Contact
  'FaEnvelope', 'FaPhone', 'FaMapMarkerAlt', 'FaGlobe', 'FaComment', 'FaComments',
  'FaShare', 'FaShareAlt', 'FaLink', 'FaExternalLinkAlt',

  // Business & Work
  'FaBuilding', 'FaBriefcase', 'FaIndustry', 'FaStore', 'FaWarehouse', 'FaFactory',
  'FaChartBar', 'FaChartLine', 'FaChartPie', 'FaAnalytics', 'FaProjectDiagram',

  // Education & Health
  'FaGraduationCap', 'FaBook', 'FaBookOpen', 'FaUniversity', 'FaSchool',
  'FaStethoscope', 'FaHospital', 'FaAmbulance', 'FaPills', 'FaHeartbeat',

  // Technology & Digital
  'FaLaptop', 'FaDesktop', 'FaMobile', 'FaTabletAlt', 'FaServer', 'FaDatabase',
  'FaWifi', 'FaBluetooth', 'FaUsb', 'FaHdd', 'FaMicrochip', 'FaRobot',

  // Media & Entertainment
  'FaPlay', 'FaPause', 'FaStop', 'FaForward', 'FaBackward', 'FaVolumeUp',
  'FaCamera', 'FaVideo', 'FaMusic', 'FaHeadphones', 'FaMicrophone', 'FaFilm',

  // Shopping & Finance
  'FaShoppingCart', 'FaShoppingBag', 'FaCreditCard', 'FaMoneyBillWave', 'FaCoins',
  'FaReceipt', 'FaCalculator', 'FaPercentage', 'FaTag', 'FaTags',

  // Transportation & Travel
  'FaCar', 'FaTruck', 'FaBus', 'FaTrain', 'FaPlane', 'FaShip', 'FaBicycle',
  'FaMotorcycle', 'FaGasPump', 'FaParking', 'FaRoad', 'FaCompass',

  // Food & Lifestyle
  'FaUtensils', 'FaCoffee', 'FaPizza', 'FaWineGlass', 'FaBeer', 'FaAppleAlt',
  'FaBed', 'FaCouch', 'FaBath', 'FaShower', 'FaUmbrella', 'FaSun',

  // Sports & Fitness
  'FaDumbbell', 'FaRunning', 'FaBiking', 'FaSwimmer', 'FaFootballBall', 'FaBasketballBall',
  'FaBaseballBall', 'FaTrophy', 'FaMedal', 'FaStopwatch', 'FaHeartbeat',

  // Nature & Environment
  'FaTree', 'FaLeaf', 'FaSeedling', 'FaFlower', 'FaMountain', 'FaWater',
  'FaFire', 'FaBolt', 'FaSnowflake', 'FaCloudRain', 'FaSun', 'FaMoon',

  // Actions & Status
  'FaPlus', 'FaMinus', 'FaEdit', 'FaTrash', 'FaSave', 'FaDownload', 'FaUpload',
  'FaCheck', 'FaTimes', 'FaExclamation', 'FaQuestion', 'FaInfo', 'FaBell',

  // Social & Community
  'FaHeart', 'FaStar', 'FaThumbsUp', 'FaThumbsDown', 'FaEye', 'FaEyeSlash',
  'FaUserFriends', 'FaHandshake', 'FaPray', 'FaChurch', 'FaMosque',
];

export default function IconSelector({ 
  selectedIcon, 
  onSelect, 
  className = '', 
  disabled = false,
  size = 'small'
}: IconSelectorProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');

  const sizeStyles = {
    small: {
      container: 'h-12',
      preview: 'w-6 h-6 ml-3',
      text: 'text-sm',
      iconSize: 'w-4 h-4'
    },
    medium: {
      container: 'h-32',
      preview: 'w-8 h-8',
      text: 'text-base',
      iconSize: 'w-6 h-6'
    },
    large: {
      container: 'h-48',
      preview: 'w-12 h-12',
      text: 'text-lg',
      iconSize: 'w-8 h-8'
    }
  };

  // Get icon component by name
  const getIconComponent = useCallback((iconName: string) => {
    return FaIcons[iconName as keyof typeof FaIcons];
  }, []);

  // Filter icons based on search term and category
  const getFilteredIcons = useCallback(() => {
    if (selectedCategory === 'Popular') {
      return popularIcons.filter(iconName =>
        iconName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // For Font Awesome category, filter all Fa icons
    return Object.keys(FaIcons).filter(iconName =>
      iconName.startsWith('Fa') &&
      iconName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      typeof FaIcons[iconName as keyof typeof FaIcons] === 'function'
    );
  }, [searchTerm, selectedCategory]);

  const renderIcon = (iconName: string, className: string = '') => {
    const IconComponent = getIconComponent(iconName);
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Icon Preview */}
      <div 
        className={`w-full rounded-lg border flex items-center ${size === 'small' ? 'justify-between' : 'flex-col justify-center'} overflow-hidden ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${sizeStyles[size].container}`}
        style={{ 
          borderColor: theme.colors.border.default,
          backgroundColor: disabled ? theme.colors.background.secondary : theme.colors.background.primary
        }}
        onClick={() => !disabled && setShowGallery(true)}
      >
        {selectedIcon ? (
          <>
            <div className={`flex items-center justify-center ${sizeStyles[size].preview} rounded overflow-hidden`}>
              {renderIcon(selectedIcon, `${sizeStyles[size].iconSize} text-gray-700`)}
            </div>
            {size === 'small' && (
              <div className="flex items-center justify-between flex-1 px-3">
                <span className={`${sizeStyles[size].text} truncate`} style={{ color: theme.colors.text.primary }}>
                  {selectedIcon}
                </span>
                {!disabled && (
                  <FiGrid className="w-4 h-4 text-gray-500 ml-2" />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between w-full px-3 text-gray-500">
            <span className={sizeStyles[size].text}>Select Icon</span>
            <FiGrid className={size === 'small' ? 'w-4 h-4' : 'w-8 h-8'} />
          </div>
        )}
      </div>

      {/* Icon Gallery Modal */}
      {showGallery && !disabled && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowGallery(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.colors.background.primary }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                Select Icon
              </h3>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border"
                style={{ 
                  borderColor: theme.colors.border.default,
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary
                }}
              />
            </div>

            {/* Category Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('Popular')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === 'Popular'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Popular
              </button>
              {Object.keys(iconCategories).map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 max-h-96 overflow-y-auto">
              {getFilteredIcons().map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => {
                    onSelect(iconName);
                    setShowGallery(false);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex items-center justify-center ${
                    selectedIcon === iconName ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                  title={iconName}
                >
                  {renderIcon(iconName, 'w-6 h-6 text-gray-700')}
                </button>
              ))}
            </div>

            {getFilteredIcons().length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No icons found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
