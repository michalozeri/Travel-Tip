import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemove = onRemove;
window.onSearch = onSearch;
window.onCopyLocation = onCopyLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
    
    onGetLocs()
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() { // to render into table 
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            renderTable(locs)
        })
}


function renderTable(locs) {
    const elTable = document.querySelector('tbody')
    const strHTML = locs.map(location => {
        return `<tr class="table-content">
        <td>${location.id}</td>
        <td>${location.name}</td>
        <td>${location.lat}</td>
        <td>${location.lng}</td>
        <td>${new Date(location.createdAt).toLocaleTimeString("he-IS")}</td>
        <td>${location.updatedAt}</td>
        <td>
        <button class="btn" onclick="onPanTo(${location.lat},${location.lng})">Go</button>
        <button class="btn" onclick="onRemove(${location.id})">Delete</button>
        </td>
        </tr>`
    })

    elTable.innerHTML = strHTML.join('')


}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            console.log(pos.coords.latitude)
            console.log(pos.coords.longitude)
            onPanTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}


function onRemove(locId) {
    console.log('sending to remove...', locId)
    locService.remove(locId)
    onGetLocs()
}

function onSearch(ev) {
    ev.preventDefault();
    const elInput = document.querySelector('[name="search"]').value
    locService.getCordsFromSearch(elInput).then(res=> {
        mapService.panTo(res.lat, res.lng)
    })
    .then(onGetLocs)

}

function onCopyLocation() {
    
}