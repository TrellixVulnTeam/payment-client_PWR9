import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

interface Props {
  value: string;
}

const ID = ({ value }: Props) => {
  return (
    <Typography variant={TypoVariants.body2} type={TypoTypes.titleDefault} weight={TypoWeights.bold}>
      {value}
    </Typography>
  );
};

export default ID;
