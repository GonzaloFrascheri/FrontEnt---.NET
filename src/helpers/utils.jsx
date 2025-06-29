const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en kilómetros
  };

const findNearestBranch = (userLat, userLng, branchesList) => {
  if (!userLat || !userLng || branchesList.length === 0) return null;

  let nearestBranch = null;
  let minDistance = Infinity;

  branchesList.forEach(branch => {
    const distance = calculateDistance(userLat, userLng, branch.lat, branch.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestBranch = { ...branch, distance };
    }
  });

  return nearestBranch;
};

const getUserLocationByIP = async () => {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();

    if (data.status === 'success' && data.lat && data.lon) {
      return {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        method: 'ip'
      };
    }
  } catch (error) {
    console.warn('Error obteniendo ubicación por IP (backup):', error);
  }

  return null;
};

export { findNearestBranch, calculateDistance, getUserLocationByIP };
