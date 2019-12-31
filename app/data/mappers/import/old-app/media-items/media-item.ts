import { ModelMapper } from 'app/data/mappers/common';
import { parseOldAppBoolean, parseOldAppDate, parseOldAppMultiValueString } from 'app/data/mappers/import/old-app/common';
import { OldAppImportanceLevel, OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { AppError } from 'app/data/models/error/error';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { MediaItemImportanceInternal, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Abstract mapper for media items
 * @template TMediaItemInternal the class of the internal media item entity
 */
export abstract class OldAppMediaItemMapper<TMediaItemInternal extends MediaItemInternal> extends ModelMapper<OldAppMediaItemInternal<TMediaItemInternal>, OldAppMediaItem, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): OldAppMediaItem {
		
		throw AppError.GENERIC.withDetails('Not required');
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: OldAppMediaItem): OldAppMediaItemInternal<MediaItemInternal> {

		// Compute completion fields
		let completionDate: Date | undefined;
		let completedOn: Date[] | undefined;
		let markedAsRedo: boolean;
		const timesCompleted = source.TIMES_COMPLETED ? Number(source.TIMES_COMPLETED) : 0;
		if(source.COMPLETION_DATE) {

			// If the old app completion date is defined, the media item is completed
			completionDate = parseOldAppDate(source.COMPLETION_DATE);
			markedAsRedo = false;
		}
		else if(timesCompleted > 0) {

			// If the old app completion date is not defined but the times completed are, the media item is marked for redo (no way to kwow the original completion date, defaulting to today)
			completionDate = new Date();
			completionDate.setHours(0, 0, 0, 0);
			markedAsRedo = true;
		}
		else {

			// If the old app completion date and times completed are both undefined, the media item is active
			completionDate = undefined;
			markedAsRedo = false;
		}
		if(completionDate) {

			// Old app did not have the list of all completion dates, default to the array of the only date we have here
			completedOn = [];
			for(let i = 0; i < timesCompleted; i++) {

				completedOn.push(completionDate);
			}
		}

		return {
			mediaItemData: {
				_id: '',
				name: source.NAME,
				category: '',
				owner: '',
				importance: this.toInternalImportance(source.IMPORTANCE_LEVEL),
				active: parseOldAppBoolean(source.DOING_NOW),
				catalogId: source.EXTERNAL_SERVICE_ID,
				completedLastOn: completedOn && completedOn.length > 0 ? completedOn[completedOn.length - 1] : undefined,
				completedOn: completedOn,
				description: source.DESCRIPTION,
				genres: source.GENRES ? parseOldAppMultiValueString(source.GENRES) : undefined,
				group: undefined,
				orderInGroup: undefined,
				imageUrl: source.IMAGE,
				markedAsRedo: markedAsRedo,
				releaseDate: source.RELEASE_DATE ? parseOldAppDate(source.RELEASE_DATE) : undefined,
				userComment: source.USER_COMMENT
			},
			owned: parseOldAppBoolean(source.OWNED)
		};
	}

	/**
	 * Helper mapper for media item importance levels
	 * @param source the source
	 * @returns the target
	 */
	private toInternalImportance(source: OldAppImportanceLevel): MediaItemImportanceInternal {
		
		switch(source) {
			case 'NONE': return '100';
			case 'LOW': return '200';
			case 'MEDIUM': return '300';
			case 'HIGH': return '400';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}
}

