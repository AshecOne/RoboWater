const BASE_URL = 'http://192.168.1.19';

export const wateringService = {
  async toggleWatering(isOn: boolean) {
    try {
      console.log('Sending request to:', `${BASE_URL}/servo`);
      console.log('Request body:', JSON.stringify({ angle: isOn ? 180 : 0 }));
      
      const response = await fetch(`${BASE_URL}/servo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          angle: isOn ? 180 : 0
        }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
  }
};