import React from 'react';
import { observer } from 'mobx-react-lite';
import { NoResultProps } from 'people/interfaces';
import { widgetConfigs } from './Constants';
import NoneSpace from './NoneSpace';

function NoResults(props: NoResultProps) {
  const tabs = widgetConfigs;

  return (
    <NoneSpace
      small
      style={{
        margin: 'auto',
        marginTop: '25%'
      }}
      {...tabs['usertickets']?.noneSpace['noResult']}
    />
  );
}
export default observer(NoResults);