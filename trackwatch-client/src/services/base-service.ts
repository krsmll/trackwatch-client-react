import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiBaseUrl } from '../configuration';
import { IFetchResponse } from '../types/IFetchResponse';
import { IMessages } from '../types/IMessages';

export abstract class BaseService<TEntity> {
    protected static axios = Axios.create({
        baseURL: ApiBaseUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    protected static getAxiosConfiguration(jwt?: string): AxiosRequestConfig | undefined {
        if (!jwt) return undefined;
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + jwt
            }
        };
        return config;
    }

    static async getAll<TEntity>(apiEndpoint: string, jwt?: string): Promise<IFetchResponse<TEntity[]>> {
        try {
            let response = await this.axios.get<TEntity[]>(ApiBaseUrl + apiEndpoint, BaseService.getAxiosConfiguration(jwt));
            return {
                ok: response.status <= 299,
                statusCode: response.status,
                data: response.data
            };
        }
        catch (err) {
            let error = err as AxiosError;
            return {
                ok: false,
                statusCode: error.response?.status ?? 500,
                messages: (error.response?.data as IMessages).messages,
            }
        }

    }

    static async get<TEntity>(id: string, apiEndpoint: string, jwt?: string): Promise<IFetchResponse<TEntity>> {
        let url = ApiBaseUrl + apiEndpoint + '/' + id;

        try {
            let response = await this.axios.get<TEntity>(url, BaseService.getAxiosConfiguration(jwt));
            console.log(response.data)
            return {
                ok: response.status <= 299,
                statusCode: response.status,
                data: response.data
            };
        } catch (err) {
            let error = err as AxiosError;
            return {
                ok: false,
                statusCode: error.response?.status ?? 500,
                messages: (error.response?.data as IMessages).messages,
            }
        }
    }

    static async put<TEntity>(id: string, entity: any, apiEndpoint: string,  jwt?: string): Promise<IFetchResponse<TEntity>> {
        let url = ApiBaseUrl + apiEndpoint + '/' + id;

        const entityStr = JSON.stringify(entity);

        try {
            const response = await this.axios.put(url, entityStr, BaseService.getAxiosConfiguration(jwt));
            return {
                ok: response.status <= 299,
                statusCode: response.status,
                data: response.data
            };
        } catch (err) {
            let error = err as AxiosError;
            return {
                ok: false,
                statusCode: error.response?.status ?? 500,
                messages: (error.response?.data as IMessages).messages,
            }
        }
    }

    static async delete<TEntity>(id: string, apiEndpoint: string, jwt?: string): Promise<IFetchResponse<TEntity>> {
        let url = ApiBaseUrl + apiEndpoint + '/' + id;
        console.log(url)

        try {
            const response = await this.axios.delete(url, BaseService.getAxiosConfiguration(jwt));
            return {
                ok: response.status <= 299,
                statusCode: response.status,
                data: response.data
            };
        } catch (err) {
            let error = err as AxiosError;
            return {
                ok: false,
                statusCode: error.response?.status ?? 500,
                messages: (error.response?.data as IMessages).messages,
            }
        }
    }

    static async post<TEntity>(entity: any, apiEndpoint: string, isObject: boolean, jwt?: string): Promise<IFetchResponse<TEntity>> {
        let url = apiEndpoint;
        let obj = null
        if (isObject) {
            obj = entity
        } else {
            url = url + "/" + entity
        }

        try {
            const response = await this.axios.post(url, obj, BaseService.getAxiosConfiguration(jwt));
            return {
                ok: response.status <= 299,
                statusCode: response.status,
                data: response.data
            };
        } catch (err) {
            let error = err as AxiosError;
            return {
                ok: false,
                statusCode: error.response?.status ?? 500,
                messages: (error.response?.data as IMessages).messages,
            }
        }
    }
}
