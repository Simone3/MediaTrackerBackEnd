import { QueryHelper } from 'app/controllers/database/query-helper';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { Document, model, Model, Schema } from 'mongoose';
import { randomName } from 'test/helpers/test-misc-helper';

const expect = chai.expect;

type TestInternalModel = PersistedEntityInternal & {
	name: string;
	description?: string;
}

const TestSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: false }
});

interface TestDocument extends TestInternalModel, Document {}

const TestModel = model<TestDocument>('TestModel', TestSchema);

const mapEntityToString = (entity: TestInternalModel): string => {

	return `${String(entity._id)} - ${entity.name}`;
};

/**
 * Tests for the query helper
 */
describe('QueryHelper Tests', () => {
	
	setupTestDatabaseConnection();

	const queryHelper = new QueryHelper<TestInternalModel, TestDocument, Model<TestDocument>>(TestModel);

	describe('Database Write Queries', () => {

		it('Save should insert a new entity', async() => {

			const newEntity: TestInternalModel = {
				_id: undefined,
				name: randomName()
			};

			const insertedEntity = await queryHelper.save(newEntity, new TestModel());
			expect(insertedEntity, 'Save (insert) returned empty result').to.exist;
			expect(insertedEntity._id, 'Save (insert) returned empty ID').to.exist;
			expect(insertedEntity.name, 'Save (insert) returned wrong name').to.equal(newEntity.name);
		});

		it('Save should update an existing entity', async() => {

			const insertedEntity = await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			const insertedId = insertedEntity._id;

			const modifiedEntity: TestInternalModel = {
				_id: insertedId,
				name: randomName()
			};

			const updatedEntity = await queryHelper.save(modifiedEntity, new TestModel());
			expect(updatedEntity, 'Save (update) returned empty result').to.exist;
			expect(updatedEntity._id, 'Save (update) returned empty ID').to.exist;
			expect(String(updatedEntity._id), 'Save (update) returned wrong ID').to.equal(String(insertedId));
			expect(updatedEntity.name, 'Save (update) returned wrong name').to.equal(modifiedEntity.name);
		});

		it('UpdateSelectiveMany should update existing entities', async() => {
			
			const firstName = 'FirstName';
			const secondName = 'SecondName';
			const firstDescription = 'FirstDescription';
			const secondDescription = 'SecondDescription';

			await queryHelper.save({ _id: undefined, name: firstName, description: firstDescription }, new TestModel());
			await queryHelper.save({ _id: undefined, name: firstName, description: firstDescription }, new TestModel());
			await queryHelper.save({ _id: undefined, name: firstName, description: secondDescription }, new TestModel());
			await queryHelper.save({ _id: undefined, name: firstName, description: firstDescription }, new TestModel());
			await queryHelper.save({ _id: undefined, name: firstName, description: secondDescription }, new TestModel());
			await queryHelper.save({ _id: undefined, name: firstName, description: undefined }, new TestModel());
			await queryHelper.save({ _id: undefined, name: firstName, description: firstDescription }, new TestModel());

			const updatedEntities = await queryHelper.updateSelectiveMany({ name: secondName }, { description: firstDescription });
			expect(updatedEntities, 'UpdateSelectiveMany returned the wrong result').to.equal(4);
			
			const firstNameEntities = await queryHelper.find({ name: firstName });
			expect(firstNameEntities, 'UpdateSelectiveMany updated the wrong entities').to.have.lengthOf(3);

			const secondNameEntities = await queryHelper.find({ name: secondName });
			expect(secondNameEntities, 'UpdateSelectiveMany did not update the expected entities').to.have.lengthOf(4);
			expect(secondNameEntities[0].description, 'UpdateSelectiveMany updated the wrong field').to.equal(firstDescription);
		});

		it('Save should throw error if updating a non-existing entity', (done) => {

			queryHelper.save({ _id: '5cbf26ea895c281b54b6737f', name: randomName() }, new TestModel())
				.then(() => {

					done('Update non-existing entity did\'t return an error');
				})
				.catch(() => {

					done();
				});
		});

		it('Delete should remove an existing entity by ID', async() => {

			const insertedEntity = await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			const insertedId = insertedEntity._id;

			const deleteCount = await queryHelper.deleteById(insertedId);
			expect(deleteCount, 'Delete by ID returned wrong count').to.equal(1);
		});

		it('Delete should throw error if deleting by ID a non-existing entity', (done) => {

			queryHelper.deleteById('5cbf26ea895c281b54b6737f')
				.then(() => {

					done('Delete non-existing entity did\'t return an error');
				})
				.catch(() => {

					done();
				});
		});

		it('Delete should remove all existing entities with empty conditions', async() => {

			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());

			const deleteCount = await queryHelper.delete({});
			expect(deleteCount, 'Delete with empty conditions returned wrong count').to.equal(3);
		});

		it('Delete should remove just some entities with valid conditions', async() => {

			const nameToDelete = randomName('Del');
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			await queryHelper.save({ _id: undefined, name: nameToDelete }, new TestModel());
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());

			const deleteCount = await queryHelper.delete({ name: nameToDelete });
			expect(deleteCount, 'Delete with name condition returned wrong count').to.equal(1);
		});

		it('Delete should return empty delete count with non-matching delete conditions', async() => {

			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());

			const deleteCount = await queryHelper.delete({ name: 'Some Non-Matching Name' });
			expect(deleteCount, 'Delete with invalid name condition returned wrong count').to.equal(0);
		});
	});

	describe('Database Read Queries', () => {

		it('Find should return empty array if empty database', async() => {

			const foundEntities = await queryHelper.find({});
			expect(foundEntities, 'Find did not return an empty array').to.be.empty;
		});

		it('Find with empty conditions should return all inserted entities', async() => {

			const insertedEntities: TestInternalModel[] = [];
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel()));
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel()));

			const foundEntities = await queryHelper.find({});
			expect(foundEntities, 'Find did not return the correct number of results').to.have.lengthOf(insertedEntities.length);
			expect(foundEntities.map(mapEntityToString), 'Find did not return the correct results').to.have.members(insertedEntities.map(mapEntityToString));
		});

		it('Find with valid conditions should return the matching entities', async() => {

			const nameToFind = randomName('FindMe');
			const insertedEntities: TestInternalModel[] = [];
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel()));
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: nameToFind }, new TestModel()));
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel()));

			const foundEntities = await queryHelper.find({ name: nameToFind });
			expect(foundEntities, 'Find did not return the correct number of results').to.have.lengthOf(1);
			expect(String(foundEntities[0]._id), 'Find did not return the correct results').to.equal(String(insertedEntities[1]._id));
		});

		it('FindOne should return undefined if empty database', async() => {

			const foundEntity = await queryHelper.findOne({});
			expect(foundEntity, 'Find returned a defined result').to.be.undefined;
		});

		it('FindOne with valid conditions should return the matching entity', async() => {

			const nameToFind = randomName('FindMe');
			const insertedEntities: TestInternalModel[] = [];
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel()));
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: nameToFind }, new TestModel()));
			insertedEntities.push(await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel()));

			let foundEntity = await queryHelper.findOne({ name: nameToFind });
			expect(foundEntity, 'Find returned an undefined result').not.to.be.undefined;
			foundEntity = foundEntity as TestInternalModel;
			expect(String(foundEntity._id), 'Find returned wrong result').to.equal(String(insertedEntities[1]._id));
		});

		it('FindOne should throw an error if more than one entity matches the conditions', async() => {

			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			await queryHelper.save({ _id: undefined, name: randomName() }, new TestModel());
			
			try {

				await queryHelper.findOne({});
			}
			catch(error) {
				
				return;
			}

			throw 'FindOne should have returned an error';
		});
	});
});

