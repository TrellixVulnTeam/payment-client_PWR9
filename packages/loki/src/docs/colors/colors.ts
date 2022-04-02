// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import colorsAsText from '!!raw-loader!../../styles/colors.scss';

const linesOfColor = colorsAsText.split('\n');
const colors = linesOfColor.map((item) => item.replace(';', '').split(':'));

export default colors;
