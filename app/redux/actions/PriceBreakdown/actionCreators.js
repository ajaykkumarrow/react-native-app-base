import * as ActionTypes from './actionTypes';

export function createOffer(invoiceId, offerData) {
  return {
    types: [
      ActionTypes.CREATE_OFFER,
      ActionTypes.CREATE_OFFER_SUCCESS,
      ActionTypes.CREATE_OFFER_FAILURE
    ],
    promise: ({ client }) =>
      client.post(`/ProformaInvoices/${invoiceId}/proformaInvoiceOffer/create`, offerData)
  };
}

export function deleteOffer(invoiceId, offerId) {
  return {
    types: [
      ActionTypes.DELETE_OFFER,
      ActionTypes.DELETE_OFFER_SUCCESS,
      ActionTypes.DELETE_OFFER_FAILURE
    ],
    promise: ({ client }) =>
      client.delete(`/ProformaInvoices/${invoiceId}/proformaInvoiceOffer/${offerId}/delete`)
  };
}

export function updateProformaAccessories(invoiceId, accessoriesData) {
  return {
    types: [
      ActionTypes.PROFORMA_ACCESSORIES,
      ActionTypes.PROFORMA_ACCESSORIES_SUCCESS,
      ActionTypes.PROFORMA_ACCESSORIES_FAILURE
    ],
    promise: ({ client }) =>
      client.put(`/ProformaInvoices/${invoiceId}/proformaInvoiceAccessories`, accessoriesData)
  };
}

export function updateProformaColor(invoiceId, colorData) {
  return {
    types: [
      ActionTypes.PROFORMA_COLOR,
      ActionTypes.PROFORMA_COLOR_SUCCESS,
      ActionTypes.PROFORMA_COLOR_FAILURE
    ],
    promise: ({ client }) =>
      client.put(`/ProformaInvoices/${invoiceId}/proformaInvoice`, colorData)
  };
}

export function getProformaInvoice(leadId, leadDetailId) {
  return {
    types: [
      ActionTypes.GET_INVOICE,
      ActionTypes.GET_INVOICE_SUCCESS,
      ActionTypes.GET_INVOICE_FAILURE
    ],
    promise: ({ client }) =>
      client.get(`/Leads/${leadId}/leadDetail/${leadDetailId}/priceBreakDown`)
  };
}

export function getVehicleDetails(vehicleId) {
  return {
    types: [
      ActionTypes.GET_VEHICLE_DETAILS,
      ActionTypes.GET_VEHICLE_DETAILS_SUCCESS,
      ActionTypes.GET_VEHICLE_DETAILS_FAILURE
    ],
    promise: ({ client }) =>
      client.get(`/Vehicles/${vehicleId}/detail`)
  };
}
