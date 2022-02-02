import { Dispatch } from '@reduxjs/toolkit';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import PauseIcon from '../../../public/icons/pause.svg';
import PlayIcon from '../../../public/icons/play-arrow.svg';
import { triggerPauseAudio, triggerPlayAudio } from '../AudioPlayer/EventTriggers';
import Card, { CardSize } from '../dls/Card/Card';
import Link, { LinkVariant } from '../dls/Link/Link';

import styles from './ReciterStationList.module.scss';
import { StationState, StationType } from './types';

import { playFrom, selectIsPlaying } from 'src/redux/slices/AudioPlayer/state';
import { selectRadioStation, setRadioStationState } from 'src/redux/slices/radio';
import { getImageCDNPath } from 'src/utils/api';
import { getRandomChapterId } from 'src/utils/chapter';
import { logEvent } from 'src/utils/eventLogger';
import { getReciterNavigationUrl } from 'src/utils/navigation';
import Reciter from 'types/Reciter';

export const playReciterStation = async (reciter: Reciter, dispatch: Dispatch<any>) => {
  const nextStationState: StationState = {
    id: reciter.id.toString(),
    type: StationType.Reciter,
    chapterId: getRandomChapterId().toString(),
    reciterId: reciter.id.toString(),
  };
  dispatch(setRadioStationState(nextStationState));

  dispatch(
    playFrom({
      chapterId: Number(nextStationState.chapterId),
      reciterId: Number(nextStationState.reciterId),
      shouldStartFromRandomTimestamp: true,
      isRadioMode: true,
    }),
  );
};

type ReciterStationListProps = {
  reciters: Reciter[];
};
const ReciterStationList = ({ reciters }: ReciterStationListProps) => {
  const dispatch = useDispatch();
  const stationState = useSelector(selectRadioStation, shallowEqual);
  const isAudioPlaying = useSelector(selectIsPlaying);

  return (
    <div className={styles.container}>
      {reciters.map((reciter) => {
        const isSelectedStation =
          stationState.type === StationType.Reciter && Number(stationState.id) === reciter.id;

        let onClick;
        if (!isSelectedStation)
          onClick = () => {
            logEvent('station_played', {
              stationId: reciter.id,
              type: StationType.Curated,
            });
            playReciterStation(reciter, dispatch);
          };
        if (isSelectedStation && isAudioPlaying) onClick = () => triggerPauseAudio();
        if (isSelectedStation && !isAudioPlaying) onClick = () => triggerPlayAudio();

        const actionIcon = isSelectedStation && isAudioPlaying ? <PauseIcon /> : <PlayIcon />;
        return (
          <Card
            actionIcon={actionIcon}
            imgSrc={getImageCDNPath(reciter.profilePicture)}
            key={reciter.id}
            onImgClick={onClick}
            title={
              <Link
                variant={LinkVariant.Primary}
                href={getReciterNavigationUrl(reciter.id.toString())}
              >
                {reciter.name}
              </Link>
            }
            description={reciter.style.name}
            size={CardSize.Medium}
          />
        );
      })}
    </div>
  );
};

export default ReciterStationList;
