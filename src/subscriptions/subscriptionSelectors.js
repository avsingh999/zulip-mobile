/* @flow */
import { createSelector } from 'reselect';

import type { Narrow } from '../types';
import { NULL_STREAM } from '../nullObjects';
import { isStreamOrTopicNarrow } from '../utils/narrow';
import { getSubscriptions, getStreams } from '../directSelectors';
import { getCurrentRouteParams } from '../baseSelectors';

export const getStreamsById = createSelector(getStreams, streams =>
  streams.reduce((streamsById, stream) => {
    streamsById[stream.stream_id] = stream;
    return streamsById;
  }, {}),
);

export const getSubscriptionsById = createSelector(getSubscriptions, subscriptions =>
  subscriptions.reduce((subsById, subscription) => {
    subsById[subscription.stream_id] = subscription;
    return subsById;
  }, {}),
);

export const getIsActiveStreamSubscribed = (narrow: Narrow) =>
  createSelector(getSubscriptions, subscriptions => {
    if (!isStreamOrTopicNarrow(narrow)) {
      return true;
    }

    return subscriptions.find(sub => narrow[0].operand === sub.name) !== undefined;
  });

export const getSubscribedStreams = createSelector(
  getStreams,
  getSubscriptions,
  (allStreams, allSubscriptions) =>
    allSubscriptions.map(subscription => ({
      ...subscription,
      ...allStreams.find(stream => stream.stream_id === subscription.stream_id),
    })),
);

export const getStreamEditInitialValues = createSelector(
  [getStreams, getCurrentRouteParams],
  (streams, params) => {
    if (!params || !params.streamId) {
      return NULL_STREAM;
    }

    return streams.find(x => x.stream_id === params.streamId) || NULL_STREAM;
  },
);
