const BASE_URL = 'http://192.168.1.13';

export const wateringService = {
  async toggleWatering(isOn: boolean) {
    try {
      const response = await fetch(`${BASE_URL}/servo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          angle: isOn ? 180 : 0
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Watering control error:', error);
      throw error;
    }
  }
};