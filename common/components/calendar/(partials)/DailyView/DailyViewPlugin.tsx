import { createPlugin, Duration, EventRenderRange } from '@fullcalendar/core';
import { DateProfile, ViewProps } from '@fullcalendar/core/internal';
import { DailyView } from './DailyView';

export type dailyViewPluginProps = ViewProps & {
   dateProfile: DateProfile;
   nextDayThreshold: Duration;
};

export const DailyViewPlugin = (props: dailyViewPluginProps) => {
  const { eventStore } = props;

  const eventsArray: EventRenderRange[] = Object.values(eventStore.instances).map(instance => {
    const def = eventStore.defs[instance.defId];
    return {
      ui: def.ui,
      isStart: true, 
      isEnd: true,
      def: def, 
      instance: instance,
      range: instance.range,
    };
  });

  return <DailyView events={eventsArray} />;
};

export default createPlugin({
   name: 'dailyView',
   views: {
      dailyView: {
         content: DailyViewPlugin,
      },
   },
});