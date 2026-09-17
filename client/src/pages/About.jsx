import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="About Trailhead Supply Co."
        description="Why Trailhead Supply Co. exists, how we test gear, and where we ship from in Bend, Oregon."
        path="/about"
      />
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'About' }]} />
      <h1 className="text-3xl mt-3 mb-6">Gear tested on trail, not just on paper</h1>

      <div className="prose-like space-y-4 text-stone-700 max-w-prose">
        <p>
          Trailhead Supply Co. started in 2016 as a two-person gear locker out of a garage in Bend, Oregon. Every
          product we carry has been on at least one overnight trip before it goes on the shelf -- if a zipper
          jams in the rain or a strap digs in on mile eight, it doesn't make the cut.
        </p>
        <p>
          We keep the catalog small on purpose. Rather than stocking twenty versions of the same tent, we pick the
          two or three that earn a place in a pack, and we say plainly what each one is and isn't good for.
        </p>
        <p>
          Orders ship from our Bend warehouse within one business day. If something doesn't work out on your trip,
          our return window is 60 days -- used gear included, as long as it's not damaged beyond normal field wear.
        </p>
      </div>
    </div>
  );
}
