import { HttpMethod } from 'app/utilities/misc-utils';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { getTestServer } from './server-handler-helper';

chai.use(chaiHttp);
const expect = chai.expect;

/**
 * Helper to call an API with basic response assertions
 * @param method the HTTP method
 * @param path the endpoint
 * @param request the optional request body
 * @param extectedStatus the expected status (defaults to 200)
 * @returns a promise containing the response body, as an object
 */
export const callHelper = async(method: HttpMethod, path: string, request?: object, extectedStatus?: number): Promise<any> => {

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

	const response = await superAgent.send(request);

	expect(response, 'API returned an empty response').not.to.be.undefined;
	expect(response.status).to.equal(extectedStatus ? extectedStatus : 200);
	expect(response.body).to.be.a('object');
	expect(response.body).not.to.be.undefined;

	return response.body;
};
