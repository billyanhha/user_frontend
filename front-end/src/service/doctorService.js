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
            query: query?.query,
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

doctorService.getDoctorDetail = async (data) => {
    try {
        const id = data?.doctorId;
        const result = await doctorService.getDoctorlDetailWithRating(id);;        
        const languages = await doctorService.getDoctorLanguage(id);
        const degrees = await doctorService.getDoctorDegree(id);
        const experiences = await doctorService.getDoctorExperience(id);
        const ratings = await doctorService.getDoctorRating(data);

        const resultData = {...result , ...languages , ...degrees, ...experiences, ...ratings};
        return resultData;
    } catch (err) {
        throw err;
    }

}

doctorService.getDoctorRating = (data) => new Promise((reslove, reject) => {
    const query = `/api/doctor/${data?.doctorId}/ratings`
    axios.get(query, {
        params: {
            itemsPage: 3,
            page: data?.pageRatingNum
        }
    })
        .then(result => reslove(result.data))
        .catch(err => reject(err))
})

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

doctorService.getDoctorlDetailWithRating = (id) => new Promise((reslove, reject) => {
    const query = '/api/doctor/' + id +'?rating=true'
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