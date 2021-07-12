import axios from 'axios';
import GenerateRequest from './Requests';

const req = GenerateRequest();

export default {
  async getSites(params) {
    try {
      const allSites = await req.get('/listWebsites', { params });
      return allSites.data;
    } catch (e) {
      console.log('Error', e);
    }
  },
  async editSite(params) {
    try {
      const newSite = await req.post(`/update/${params._id}`, params);
      return newSite;
    } catch (e) {
      console.log('Error', e);
    }
  },
  async addSite(params) {
    try {
      const newSite = await req.post(`/addWebsite/`, params);
      return newSite;
    } catch (e) {
      console.log('Error', e);
    }
  },
  async deleteSite(params) {
    try {
      const deletedSite = await req.post(`/delete/${params._id}`);
      return deletedSite;
    } catch (e) {
      console.log('Error', e);
    }
  },

  async accountUpdate(params) {
    try {
      const deletedSite = await req.post(
        `/accountUpdate/${params._id}/${params.op}`,
        params
      );
      return deletedSite;
    } catch (e) {
      console.log('Error', e);
    }
  },

  async getMetrics() {
    try {
      const allSites = await req.get('/');
      console.log('>>', allSites.data)
      return allSites.data;
    } catch (e) {
      console.log('Error', e);
    }
  },
};
