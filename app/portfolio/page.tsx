import { PageHero } from '@/components/PageHero';
import { PortfolioFilter } from '@/components/PortfolioFilter';

const portfolioImages = [
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864', alt: 'Rodinné focení v přírodě', category: 'rodinna' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/287,0,1287,1000,580,580,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2088681039~hmac=22be9649398a9ea56ec377944dcd6bd02254347ecc8e43027ed7075709fe618c', alt: 'Rodina v přírodě', category: 'rodinna' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e', alt: 'Portréty', category: 'portret' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581', alt: 'Newborn focení', category: 'newborn' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2088927693~hmac=e5651265ed7944c54ef2104fff6f891c739eeae40455d82b8168c81c91edacf0', alt: 'Newborn miminko', category: 'newborn' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723', alt: 'Svatební focení', category: 'svatby' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/0bbb0044-6aac-4da5-8043-4c09d06b8164/1/1/192.jpg?fjkss=exp=2088920790~hmac=77261ddf4add0008600b2e0b4dacb93e5a710de8a3ec6ff85a0d2ada0c8b3165', alt: 'Svatební den', category: 'svatby' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a', alt: 'Focení psích kamarádů', category: 'psi' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c', alt: 'Těhotenské focení', category: 'tehotenske' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/3f875228-71be-40bf-96d2-b419364599a1/1/1/_FFF5983.jpg?fjkss=exp=2088681035~hmac=2e9c039a5620e3d43d3fe64b3f7daef7015cc8ae1b4d717a0fea903df01196c7', alt: 'Rodinné focení venku', category: 'rodinna' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/77117316-7f64-4db7-8b23-d32496550df9/1/1/_FFF7059.jpg?fjkss=exp=2088927709~hmac=d73e6ebc3df068b24965421c829df9026c667decd48f2b207774d18a99d1bcd5', alt: 'Newborn v ateliéru', category: 'newborn' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1200,800,1600,800/0-0-0/283bbdbb-fafa-42f3-9c5d-ee1044b1dfc2/1/1/_FFF8973-SharpenAI-Focus.jpg?fjkss=exp=2088681035~hmac=56bc05a3fd90f6fdd7220cfbd6907096d70ae4eda0d333aa86dd01aecffe9d4c', alt: 'Rodina a děti', category: 'rodinna' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d', alt: 'Portrét', category: 'portret' },
  { src: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,800,1200,1600,1200/0-0-0/e73300d8-5661-4b60-8039-bd421a04ddfa/1/1/_FFF9854.jpg?fjkss=exp=2088920600~hmac=7012a75d6187677fa811f9a01dbd2f217af3a83b2a2bfbd3378d20da1d9f46d8', alt: 'Portrétní fotka', category: 'portret' },
];

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        title="Portfolio"
        subtitle="Výběr z mé práce"
        image="https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/3f875228-71be-40bf-96d2-b419364599a1/1/1/_FFF5983.jpg?fjkss=exp=2088681035~hmac=2e9c039a5620e3d43d3fe64b3f7daef7015cc8ae1b4d717a0fea903df01196c7"
      />

      <section className="section" data-animate>
        <div className="container">
          <PortfolioFilter images={portfolioImages} />
        </div>
      </section>
    </>
  );
}
