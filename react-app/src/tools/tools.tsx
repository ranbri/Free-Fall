/**
 * API Request handler
 * @param url - api endpoint
 * @param method - http method
 * @param bodyParams - body parameters of request
 * @param token - JWT token
 */
export const apiRequest = async (
    url: string,
    method: string,
    bodyParams?: string | object
  ): Promise<any> => {
    const response = await fetch(url, {
      method,
      body: bodyParams ? JSON.stringify(bodyParams) : undefined
    });
    return await response.json();
  };
  
  export const apiRequestWithImg = async (
    url: string,
    method: string,
    bodyParams?: any
  ): Promise<any> => {
    const response = await fetch(url, {
      mode: 'no-cors',
      method,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: bodyParams
    });
    return await response;
  };