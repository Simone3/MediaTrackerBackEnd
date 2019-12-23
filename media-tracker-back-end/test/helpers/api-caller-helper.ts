import { HttpMethod } from 'app/utilities/misc-utils';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { buildFakeAuthToken } from './auth-handler-helper';
import { getTestServer } from './server-handler-helper';

chai.use(chaiHttp);
const expect = chai.expect;

/**
 * Helper to define optional extra config for callHelper()
 */
export type CallHelperExtraConfig = {

	/**
	 * The expected status (defaults to 200)
	 */
	expectedStatus?: number;

	/**
	 * A custom "Authorization" header (defaults to the base "loggedUserId" Bearer value)
	 */
	customAuthorizationHeader?: string;
}

/**
 * Helper to call an API with basic response assertions
 * @param method the HTTP method
 * @param path the endpoint
 * @param loggedUserId the currently logged user
 * @param request the optional request body
 * @param extraConfig  optional extra config
 * @returns the response body, as a promise
 */
export const callHelper = async<TReq extends object, TRes extends object>(method: HttpMethod, path: string, loggedUserId: string, request?: TReq, extraConfig?: CallHelperExtraConfig): Promise<TRes> => {

	const agent = chai.request(getTestServer());
	let superAgent;

	switch(method) {
		
		case 'GET':
			superAgent = agent.get(path);
			break;

		case 'POST':
			superAgent = agent.post(path);
			break;

		case 'PUT':
			superAgent = agent.put(path);
			break;

		case 'DELETE':
			superAgent = agent.delete(path);
			break;

		default:
			throw 'Unsupported method in test call helper';
	}

	const authorizationHeader = extraConfig && extraConfig.customAuthorizationHeader !== undefined ? extraConfig.customAuthorizationHeader : `Bearer ${buildFakeAuthToken(loggedUserId)}`;
	superAgent.set('Authorization', authorizationHeader);

	const response = await superAgent.send(request);

	expect(response, 'API returned an empty response').not.to.be.undefined;
	expect(response.status).to.equal(extraConfig && extraConfig.expectedStatus ? extraConfig.expectedStatus : 200);
	expect(response.body).to.be.a('object');
	expect(response.body).not.to.be.undefined;

	return response.body;
};
