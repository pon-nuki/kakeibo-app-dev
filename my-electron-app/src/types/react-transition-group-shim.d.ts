declare module 'react-transition-group/Transition' {
  import * as RTG from 'react-transition-group';
  import { ComponentType } from 'react';

  type TransitionComponent = typeof RTG.Transition;
  export type TransitionProps = React.ComponentProps<TransitionComponent>;
  export const Transition: ComponentType<TransitionProps>;
}

declare module 'react-transition-group/CSSTransition' {
  import * as RTG from 'react-transition-group';
  import { ComponentType } from 'react';

  type CSSTransitionComponent = typeof RTG.CSSTransition;
  export type CSSTransitionProps = React.ComponentProps<CSSTransitionComponent>;
  export const CSSTransition: ComponentType<CSSTransitionProps>;
}
