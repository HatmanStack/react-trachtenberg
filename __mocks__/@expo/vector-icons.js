// Mock for @expo/vector-icons
const React = require('react');

const createIconComponent = () => {
  return (props) => React.createElement('Icon', props);
};

module.exports = {
  MaterialCommunityIcons: createIconComponent(),
  Ionicons: createIconComponent(),
  FontAwesome: createIconComponent(),
  Feather: createIconComponent(),
};
