import axios, { type AxiosInstance } from 'axios';
import { type CloudStack } from './types';

const PULUMI_CLOUD_ENDPOINT: string = "https://api.pulumi.com";
const REQUIRED_HEADERS: any = {'Accept': "application/vnd.pulumi+8",
                                'Content-Type': "application/json"};
const DEFAULT_API_TIMEOUT = 1000;

/**
 * Wrapper SDK class around the Pulumi Cloud Rest API
 */
export class CloudClient {
  private axiosInstance: AxiosInstance;
  /**
   * Instantiates instance of Pulumi Cloud SDK
   * 
   * @param authToken - A string for the Authorization Token
   * when making API calls to Pulumi Cloud. This can be retrieved 
   * in https://app.pulumi.com/account/tokens
   * @param timeout - An optional field specifying how many milliseconds
   * until the API request times out
   */
  constructor(private authToken: string, private timeout: number = DEFAULT_API_TIMEOUT) {
    this.axiosInstance = axios.create({
      baseURL: PULUMI_CLOUD_ENDPOINT,
      timeout: timeout,
      headers: {...REQUIRED_HEADERS, 'Authorization': `token ${authToken}`}
    })
  }

  /**
   * Creates an empty stack in Pulumi Cloud with the given organization and project names
   * 
   * @param organizationName - Organization name to create stack on
   * @param projectName - Project name to create stack on
   * @param stackName - Name for the created stack
   */
  async createStack(organizationName: string, projectName: string, stackName: string) {
    await this.axiosInstance.post(
      `/api/stacks/${organizationName}/${projectName}`, 
      { stackName: stackName }
    );
  }

}