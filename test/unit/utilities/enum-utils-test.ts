import { enumUtils } from 'app/utilities/enum-utils';
import chai from 'chai';

const expect = chai.expect;

enum TestEnum {

	MY_VALUE,
	ANOTHER,
	SOMETHING_ELSE
}

/**
 * Tests for the enum utilities
 */
describe('EnumUtils Tests', () => {
	
	describe('EnumUtils Tests', () => {

		it('Should correctly list the enum value names', (done) => {

			const values: string[] = enumUtils.getEnumStringValues(TestEnum);
			expect(values).to.have.lengthOf(3);
			expect(values).to.have.members([ 'MY_VALUE', 'ANOTHER', 'SOMETHING_ELSE' ]);
			
			done();
		});

		it('Should correctly list the enum value names', (done) => {

			const values: TestEnum[] = enumUtils.getEnumValues(TestEnum);
			expect(values).to.have.lengthOf(3);
			expect(values).to.have.members([ 0, 1, 2 ]);

			done();
		});
	});
});
