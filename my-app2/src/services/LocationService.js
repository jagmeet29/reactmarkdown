export class LocationService {
  static async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const detailedLocation = await this.getDetailedLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              },
              ...detailedLocation
            });
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  static async getDetailedLocation(latitude, longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) {
        throw new Error('Failed to get location details');
      }
      const data = await response.json();
      return {
        address: data.display_name,
        details: {
          country: data.address.country,
          state: data.address.state,
          city: data.address.city || data.address.town || data.address.village,
          postcode: data.address.postcode,
          road: data.address.road,
          suburb: data.address.suburb
        }
      };
    } catch (error) {
      console.error('Error getting location details:', error);
      return {
        address: 'Location details unavailable',
        details: {}
      };
    }
  }
}
