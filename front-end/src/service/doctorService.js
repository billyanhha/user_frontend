import axios from "../axios";
const doctorService = {};



doctorService.getDoctorByJwt = (token) => new Promise((reslove, reject) => {
    const api = "/api/doctor/jwt/one";    
    axios.get(api, {
        headers: {
            Authorization: "Bearer " + token,
            Accept: '*/*'
        }
    })
        .then(result => {            
            reslove(result.data)
        })
        .catch(err => reject(err))
});



doctorService.getDoctorForHome = () => new Promise((reslove, reject) => {
    axios.get('/api/doctor', {
        params: {
            itemsPage: 3,
            page: 1,
            sort: 'average_rating',
            order: 'desc'

        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorQuery = (query) => new Promise((reslove, reject) => {
    axios.get('/api/doctor', {
        params: {
            fullname: query?.query,
            sort: query?.sortBy,
            itemsPage: 6,
            page: query?.page,
            active: true,
            order: 'desc'
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
});

doctorService.getDoctorDetail = async (id) => {
    try {
        const result = await doctorService.getDoctorNormalDetail(id);;        
        const languages = await doctorService.getDoctorLanguage(id);
        const degrees = await doctorService.getDoctorDegree(id);
        const experiences = await doctorService.getDoctorExperience(id);

        const data = {...result , ...languages , ...degrees, ...experiences};
        return data;
    } catch (err) {
        throw err;
    }

}

doctorService.getDoctorExperience = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id + '/experiences'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorNormalDetail = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorLanguage = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id + '/languages'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

doctorService.getDoctorDegree = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id + '/degrees'
    axios.get(query)
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})





export default doctorService;