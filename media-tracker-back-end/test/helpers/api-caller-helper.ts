import { HttpMethod } from 'app/utilities/misc-utils';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { getTestServer } from './server-handler-helper';

chai.use(chaiHttp);
const expect = chai.expect;

/**
 * Helper to call an API with basic response assertions
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
