import { Grid } from '@material-ui/core';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import React from 'react';
import styles from './styles.module.scss';
import TopBar from './TopBar';

// const layoutClasses = { sidebar: styles.sidebar, main: styles.main };

// const getParentPropsOfChildren = (child: any): string => _get(child, '_owner.stateNode.props');

const StyleGuideRenderer = ({ children, toc, title, version, ...rest }: any): JSX.Element => {
  // const parentProps = getParentPropsOfChildren(children);
  // const searchController = React.useRef();

  const navbar = (
    <TopBar>
      <Grid container className={styles.nav} alignItems="center" justifyContent="space-between">
        <Grid item md={10} className={styles['left-content']}>
          <Typography
            href="/"
            variant={TypoVariants.head4}
            weight={TypoWeights.bold}
            className={styles.title}
            type={TypoTypes.invert}
          >
            Alopay Styleguide
          </Typography>
          <Typography variant={TypoVariants.caption} className={styles.version} type={TypoTypes.invert}>
            {version}
          </Typography>
        </Grid>
      </Grid>
    </TopBar>
  );

  return (
    <div className={styles.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {navbar}
        </Grid>
        <Grid item xs={2}>
          {toc}
        </Grid>
        <Grid item xs={10}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default StyleGuideRenderer;
