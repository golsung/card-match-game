import 'styled-components';
import { Theme } from './theme';

/**
 * Styled Components Theme Type Declaration
 * styled-components의 DefaultTheme을 확장하여 타입 안정성 확보
 */
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
