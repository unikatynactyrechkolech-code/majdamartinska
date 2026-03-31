'use client';

import { PageHero } from '@/components/PageHero';
import { EditableText } from '@/components/EditableText';

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog"
        subtitle="Příběhy, tipy a zákulisí focení"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,3655,2421,2500,2421/0-0-0/22e58576-8744-4781-94bf-611c637df94a/1/1/gina27.jpg?fjkss=exp=2090606687~hmac=b582ea2298956095d2332d662c9acdfeb05bf3aee720839ffc62deff28187445"
        sectionPrefix="blog.hero"
      />

      <section className="section section-brown" data-animate>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p className="section-label">
            <EditableText sectionId="blog.label" defaultValue="BLOG" as="span" />
          </p>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            <EditableText sectionId="blog.title" defaultValue="Už brzy tu budou příspěvky" as="span" />
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.7, lineHeight: 1.7 }}>
            <EditableText
              sectionId="blog.empty"
              defaultValue="Pracuji na tom, aby tu pro vás brzy byly zajímavé články, tipy na focení a příběhy ze zákulisí. Sledujte mě na sociálních sítích, ať vám nic neuteče&nbsp;📸"
              as="span"
            />
          </p>
        </div>
      </section>
    </>
  );
}
