import { AngleRight } from 'assets/icons/ILT';
import Breadcrumbs from 'components/StyleGuide/Breadcrumbs';
import Icon from 'components/StyleGuide/Icon';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import React from 'react';
import { useBreadcrumbs } from '../useBreadcrumbs';
import styles from './styles.module.scss';
import _isEmpty from 'lodash-es/isEmpty';
import { Link } from 'react-router-dom';

interface Props {}

const AlopayBreadcrumb = (props: Props) => {
  const { breadcrumbs } = useBreadcrumbs();
  return (
    <Breadcrumbs separator={<Icon className={styles['icon']} width={11} height={11} component={AngleRight} />}>
      {!_isEmpty(breadcrumbs) &&
        breadcrumbs.map((item, index) => (
          <>
            {item.active ? (
              <Typography
                key={`breadcrumbs-item-${index}`}
                variant={TypoVariants.body1}
                type={item.active ? TypoTypes.default : TypoTypes.titleSub}
                weight={TypoWeights.bold}
              >
                {item.label}
              </Typography>
            ) : (
              <Link key={`breadcrumbs-item-${index}`} to={item.to}>
                <Typography
                  variant={TypoVariants.body1}
                  type={item.active ? TypoTypes.default : TypoTypes.titleSub}
                  weight={TypoWeights.bold}
                >
                  {item.label}
                </Typography>
              </Link>
            )}
          </>
        ))}
    </Breadcrumbs>
  );
};

export default AlopayBreadcrumb;
