const http = require('http');
http.get('http://localhost:5001/api/games', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      console.log('Count:', parsed.count);
      console.log('Data length:', parsed.data ? parsed.data.length : 0);
      if (parsed.data && parsed.data.length > 0) {
        console.log('First _id:', parsed.data[0]._id);
      }
    } catch(e) {
      console.log('Error parsing:', e.message);
    }
  });
});
