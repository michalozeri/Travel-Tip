
export const locService = {
    getLocs,
    remove,
    getCordsFromSearch
}

const KEY = 'locationsDB'
var gNextId = 101
const locs = [ //to render into table
    { id: ++gNextId, name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: Date.now(), updateAt:null}, 
    { id: ++gNextId, name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt: Date.now(), updateAt:null }
]

_saveLocsToStorage()


function getLocs() {
    console.log(locs)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function remove(locId) {
    console.log('removing...', locId)
    var locIdx =locs.findIndex(loc => {
        return loc.id === locId
    })
    locs.splice(locIdx,1)
    _saveLocsToStorage()


}


function getCordsFromSearch(search='tel aviv') {
    const API_KEY = 'AIzaSyCGOt0DDX3Sv5k5Aw6G8a9AtcbTHCDB8iE';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${API_KEY}`)
    .then(res => {
        var location = {
            id: ++gNextId,
            name: search,
            lat:res.data.results[0].geometry.location.lat, 
            lng:res.data.results[0].geometry.location.lng,
            createdAt: Date.now(),
            updateAt:null
        }
        locs.push(location)
        _saveLocsToStorage()
        return res.data.results[0].geometry.location

    })
    .catch(err => {
        console.log('Couldnt find location',err)
    })

}


function _saveLocsToStorage() {
    saveToStorage(KEY, locs)
}

