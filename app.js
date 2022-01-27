

async function getCoords() {
    const pos =  await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude] 
}

function renderMap(coords){
 
    let latlngTriangle = [];
    const selector = document.querySelector('#selector')

    //Generating Map & Business pin
    const mapPin = L.icon({
        iconUrl: './assets/red-pin.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    })

    const businessPin = L.icon({
        iconUrl: './assets/map-pin-solid.svg',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    })


    //generating map
    const myMap = L.map("map", {
        center: [coords[0], coords[1]],
        zoom: 12,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
    }).addTo(myMap)

    // Creating user location pin
    const userPin = L.marker([coords[0], coords[1]], {icon: mapPin}).bindPopup('You are here!').addTo(myMap);


    // Event Listeners

    myMap.on('click', onMapClick)
    // Pin drop on mouse click
    function onMapClick(e) {
        latlngTriangle.push(e.latlng)
        console.log(latlngTriangle)
        const pinMarker = L.marker([e.latlng.lat, e.latlng.lng], {icon: mapPin}).bindPopup(e.latlng.toString()).addTo(myMap)     
        triangleDraw(latlngTriangle)
    }

    //Selector business pin drop
    selector.addEventListener('change', async (e) => {
  
        if(e.target.value === 'coffee') {
            console.log('imhere!')
            const options = {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  Authorization: 'fsq3kToBSoM5rDmMiuzoWS72yfA7woXL5nownBCz6yjRimc='
                }
              };
              
              let response = await fetch('https://api.foursquare.com/v3/places/search?ll='+ coords[0] + '%2C'+ coords[1] + '&radius=6000&categories=13032%2C%2013035%2C%2013034', options)
                .then(response => response.json())
                .catch(err => console.error(err));
       
            response.results.forEach(result => {
               L.marker([result.geocodes.main.latitude, result.geocodes.main.longitude], {icon: businessPin}).bindPopup(result.name.toString()).addTo(myMap)
            })

        }else if(e.target.value === 'restaurant') {
           
            const options = {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  Authorization: 'fsq3kToBSoM5rDmMiuzoWS72yfA7woXL5nownBCz6yjRimc='
                }
              };
              
              let response = await fetch('https://api.foursquare.com/v3/places/search?ll='+ coords[0] + '%2C'+ coords[1] + '&radius=8000&categories=13065', options)
                .then(response => response.json())
                .catch(err => console.error(err));
    
            response.results.forEach(result => {
                L.marker([result.geocodes.main.latitude, result.geocodes.main.longitude], {icon: businessPin}).bindPopup(result.name.toString()).addTo(myMap)
            })

        } else if(e.target.value === 'hotel'){
    
            const options = {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  Authorization: 'fsq3kToBSoM5rDmMiuzoWS72yfA7woXL5nownBCz6yjRimc='
                }
              };
              
              let response = await fetch('https://api.foursquare.com/v3/places/search?ll='+ coords[0] + '%2C'+ coords[1] + '&radius=5000&categories=19009', options)
                .then(response => response.json())
                .catch(err => console.error(err));
            console.log(response.results)
            response.results.forEach(result => {
                L.marker([result.geocodes.main.latitude, result.geocodes.main.longitude], {icon: businessPin}).bindPopup(result.name.toString()).addTo(myMap)
            })

        } else if(e.target.value === 'market'){
            const options = {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  Authorization: 'fsq3kToBSoM5rDmMiuzoWS72yfA7woXL5nownBCz6yjRimc='
                }
              };
              
              let response = await fetch('https://api.foursquare.com/v3/places/search?ll='+ coords[0] + '%2C'+ coords[1] + '&radius=5000&categories=17000%2C17069', options)
                .then(response => response.json())
                .catch(err => console.error(err));
            console.log(response.results)
            response.results.forEach(result => {
                L.marker([result.geocodes.main.latitude, result.geocodes.main.longitude], {icon: businessPin}).bindPopup(result.name.toString()).addTo(myMap)
            })
        }
    })




    // Extra Functions
    
    function triangleDraw(latlng) {
        if(latlng.length === 3) {
            L.polygon(latlng, {color: 'red'}).addTo(myMap)
            latlng.length = 0
        }else {
            return false
        }
    }
}



window.onload =  async () => {
    const coords = await getCoords()
    renderMap(coords)
}
