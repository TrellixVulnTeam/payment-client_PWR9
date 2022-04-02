import React, { ReactNode } from 'react';
import { t } from 'i18next';
import { Box } from '@material-ui/core';

import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';

type StaticBoxProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

export default function StaticBox({ label, onClick, icon: Icon }: StaticBoxProps) {
  return (
    <Paper radius={PaperRadius.bold} background={PaperBackgrounds.ghost}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingX={3} paddingY={2}>
        <Box>
          <Typography variant={TypoVariants.head3}>{label}</Typography>
          <Box mt={2}>
            <Typography
              component="a"
              variant={TypoVariants.button1}
              weight={TypoWeights.medium}
              type={TypoTypes.link}
              onClick={onClick}
            >
              {uppercaseFirstLetterAllWords(t('View detail'))}
            </Typography>
          </Box>
        </Box>
        <Box>{Icon}</Box>
      </Box>
    </Paper>
  );
}
