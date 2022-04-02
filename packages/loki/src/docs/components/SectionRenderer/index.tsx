import Typography from 'components/StyleGuide/Typography';
import React from 'react';
import styles from './styles.module.scss';

function SectionRenderer(props: any): JSX.Element {
  // const { name, slug, content, components, sections, depth, description, pagePerSection } = props;
  const { name, content, components, sections, description } = props;

  return (
    <section data-testid={`section-${name as string}`} className={styles.root}>
      {name && <Typography>{name}</Typography>}
      {description && <Typography>{description}</Typography>}
      {content}
      {sections}
      {components}
    </section>
  );
}

export default SectionRenderer;
