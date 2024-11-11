import AllergenIngredient from "@/types/AllergenIngredient";

const unhealthyIngredients: AllergenIngredient[] = [
    { name: 'acesulfam de potasiu', group: 'Îndulcitor', description: 'Acesulfamul de potasiu(E950) este un aditiv alimentar sintetic cu rol de îndulcitor. Este de circa 200 de ori mai dulce decât zahărul, comparând cantităţi egale din cele două produse. Acest aditiv este utilizat în general în bauturi carbogazoase dietetice, deserturi sau lactate. În timp ce anumite studii spun ca are potențial cancerigen, alte studii spun ca acesulfamul de potasiu se elimină nemodificat prin urină.'},
    { name: 'aloe vera', group: 'Arome', description: 'Aloe vera provine din planta suculentă cu același nume. Este utilizată în produsele cosmetice și în băuturi pentru a oferi un gust și un miros plăcut, dar și în alte produse alimentare. Studii la nivel internațional au descoperit că aloina și antrachionii din aloe vera pot produce cancer intestinal. Cât timp antrachionii sunt eliminați din produs, aloe vera este sigură pentru consum.'},
    { name: 'aspartam', group: 'Îndulcitor', description: 'Aspartamul(E951) este un îndulcitor artificial utilizat în produsele alimentare pentru a le oferi un gust dulce fără a adăuga calorii. Acesta este de aproximativ 200 de ori mai dulce decât zahărul. Aspartamul este utilizat în produsele dietetice, cum ar fi băuturile carbogazoase, dulciurile, deserturile și produsele de patiserie. Acesta este controversat, deoarece unii oameni de știință consideră că poate fi dăunător pentru sănătate. Cu toate acestea, autoritățile de reglementare din întreaga lume au stabilit că aspartamul este sigur pentru consum.'},
    { name: 'azodicarbonamida', group: 'Colorant', description: 'Azodicarbonamida este un aditiv alimentar utilizat pentru a albi făina și pentru a îmbunătăți textura produselor de panificație. Acesta este utilizat în produsele de panificație, cum ar fi pâinea, chiflele și produsele de patiserie. Azodicarbonamida este controversată, deoarece poate produce azot, monoxid de carbon și dioxid de carbon atunci când este încălzită la temperaturi ridicate. Cu toate acestea, autoritățile de reglementare din întreaga lume au stabilit că azodicarbonamida este sigură pentru consum.'},
    { name: 'ulei vegetal bromurat', group: 'Emulsificator', description: 'Uleiul vegetal bromurat este un aditiv alimentar utilizat pentru a îmbunătăți textura produselor de panificație. Acesta este utilizat în produsele de panificație, cum ar fi pâinea, chiflele și produsele de patiserie, dar și în băuturi carbogazoase și necarbogazoase. Uleiul vegetal bromurat este controversat, deoarece poate produce bromat, un compus chimic care poate fi toxic pentru organism în cantități mari și poate provoca modificări asupra celulelor din organism provocând probleme neurologice sau de comportament. Cu toate acestea, autoritățile de reglementare din întreaga lume au stabilit că uleiul vegetal bromurat este sigur pentru consum.'},
    { name: 'butil hidroxianisol', group: 'Conservant', description: 'BHA(E320) este un aditiv alimentar din categoria antioxidanţilor sintetici, cu rol în prevenirea râncezirii grăsimilor. Se utilizează individual sau în combinaţie cu alţi butilaţi sau galaţi (E 310 – 312) în diverse grăsimi animale sau vegetale, cât şi în amestecuri pentru patiserie, snacksuri, supe şi ciorbe instant, sosuri, fructe procesate, cereale preparate, suplimente nutritive, mirodenii, produse din carne, cartofi deshidrataţi, arome şi lapte praf pentru distribuitoarele automate. Este o substanță cu potențial cancerigen și nu este permis în alimentele destinate copiilor mici și sugarilor.'},
    { name: 'E150a', group: 'Colorant', description: 'Caramelul E 150 a are culoarea brună, este solubil în alcool şi în mediu acid. Este utilizat la extracte de cafea. Cercetătorii au descoperit că în cantități mare are potențial cancerigen.'},
    { name: 'E150b', group: 'Colorant', description: 'Caramelul E 150 b are culoarea galben-oranj, este solubil în alcool, în mediu acid și în prezența taninului. Se folosește la obținerea lichiorurilor, romului, coniacului sau la aperitive pe bază de vin. Cercetătorii au descoperit că în cantități mari are potențial cancerigen.'},
    { name: 'E150c', group: 'Colorant', description: 'Caramelul E 150 c are culoarea brună, este solubil în mediu acid şi în prezența taninului, dar insolubil în alcool. Se utilizează la obținerea sosurilor, a berii, la colorarea şi aromatizarea oțetului. Cercetătorii au descoperit că în cantități mari are potențial cancerigen.'},
    { name: 'E150d', group: 'Colorant', description: 'Caramelul E 150 d are culoarea brună-gri, este solubil în prezența taninului şi în mediul acid, dar insolubil în alcool. Este utilizat la prepararea băuturilor carbonatate şi a produselor de patiserie. Cercetătorii au descoperit că în cantități mari are potențial cancerigen.'},
    { name: 'ciclamat', group: 'Îndulcitor', description: 'Ciclamatul de sodiu(E952) este un edulcorant alimentar sintetic, cu putere mare de îndulcire. Este de aproximativ 30-50 de ori mai dulce decât zahărul, comparând cantităţi egale din cele două substanţe. În urma folosirii îndelungate a ciclamaților aceștia pot produce tulburări gastro-intestinale. Ingerat în doze mari, ciclamatul produce în unele cazuri diaree, reacții cutanate, dermatite, urticarii sau edeme. Ciclohexilamina, care este metabolitul principal al ciclamaților, se formează în special în intestine sub influența enterococilor.'},
    { name: 'ciclamat de sodiu', group: 'Îndulcitor', description: 'Ciclamatul de sodiu(E952) este un edulcorant alimentar sintetic, cu putere mare de îndulcire. Este de aproximativ 30-50 de ori mai dulce decât zahărul, comparând cantităţi egale din cele două substanţe. În urma folosirii îndelungate a ciclamaților aceștia pot produce tulburări gastro-intestinale. Ingerat în doze mari, ciclamatul produce în unele cazuri diaree, reacții cutanate, dermatite, urticarii sau edeme. Ciclohexilamina, care este metabolitul principal al ciclamaților, se formează în special în intestine sub influența enterococilor.'},
    { name: 'ginkgo biloba', group: 'Suplimente', description: 'Ginkgo biloba este un supliment adăugat de multe companii în băuturi, deoarece se presupune că aceste îmbunătățește memoria și gândirea. Deoarece ginkgo biloba s-a dovedit că interferează cu coagularea sângelui, nu ar trebui consumat înainte sau dupa o intervenție chirurgicală, de către femeile însărcinate sau de persoanele cu probleme de sângerare. În doze mari ginkgo biloba poate provoca cancer hepatic sau tiroidian.'},
    { name: 'olestra', group: 'Substitut de grăsime', description: 'Olestra este un substitut de grăsime artificial utilizat în unele produse alimentare pentru a reduce conținutul de grăsimi și calorii. Deși olestra poate fi utilă pentru cei care doresc să reducă aportul caloric din grăsimi, are și efecte secundare. Consumul său poate duce la tulburări gastrointestinale, cum ar fi crampe abdominale și diaree, deoarece nu este digerată și poate inhiba absorbția vitaminelor liposolubile (A, D, E și K).'},
    { name: 'bromat de potasiu', group: 'Interzis', description: 'Bromatul de potasiu este un compus utilizat de obicei ca ameliorator de făină. Funcția bromatului de potasiu este de a întări aluatul și de a oferi o creștere mai mare. Cu toate acestea, s-a descoperit că această substanță chimică provoacă cancer de rinichi, tiroida, stomac și intestin la animale. Din acest motiv, se crede că este cancerigen și la om. Acesta este interzis în Europa!'},
    { name: 'iodat de potasiu', group: 'Aditiv alimentar', description: 'Iodatul de potasiu este un aditiv alimentar cu funcţii de agent de oxidare, de afânare sau conservant cu proprietatea de a elibera Iod în combinație cu Clorul. Are un mic risc cancerigen în cantități prea mari, din cauza iodului.'},
    { name: 'galat de propil', group: 'Conservant', description: 'Galatul de propil(E310) este un aditiv alimentar din categoria antioxidanţilor, obţinut pe cale chimică din propanol şi acid galic, folosit atât în industria produselor cosmetice, cât şi în producţia alimentară. Utilizat ca antioxidant împotriva râncezirii grăsimilor din alimente individual sau în combinaţie cu alţi galaţi sau butilaţi, în diverse grăsimi animale sau vegetale, cât şi în amestecuri pentru patiserie, snacksuri, supe şi ciorbe instant, sosuri, fructe procesate, cereale, mirodenii, produse din carne, cartofi deshidrataţi, arome şi lapte praf. Poate provoca Eczeme cutanate, afecţiuni gastrice şi hiperactivitate. Nu este permis în alimentele destinate copiilor mici'},
    { name: 'zaharina', group: 'Îndulcitor', description: 'Aditiv alimentar cu rol de îndulcitor artificial. Deşi are un gust remanent neplăcut, amărui metalic, zaharina a fost folosită pe scară largă, atât de diabetici, cât şi în industria alimentară, fiind de 300-500 de ori mai dulce decât zahărul. Fiind un îndulcitor intens şi fără calorii, care nu produce carii dentare, se adaugă în băuturi alcoolice şi nealcoolice aromatecât şi în snacksuri şi deserturi cu valoare energetică redusă, fără adaos de zahăr, pe bază de apă, lapte, amidon, cacao, grăsimi, ouă, cereale sau fructe, în produse de cofetărie cu valoare energetică scăzută şi fără adaos de zahăr. Cercetări datând încă din 1960 au arătat potenţialul cancerigen al zaharinei asupra animalelor de laborator, localizat în special la vezica urinară şi tractul urinar'},
    { name: 'nitrat de sodiu', group: 'Conservant', description: 'Nitratul de sodiu(E251) este o sare anorganică utilizată în industria alimentară, în special în produsele ultraprocesate, datorită proprietăților sale de conservare. Când este adăugat în alimente, nitratul de sodiu se transformă în nitrit de sodiu. Este folosit în special în alimente precum șunca, salam, cârnați și alte mezeluri. nul dintre principalele motive de îngrijorare este formarea de nitrozamine. Nitrozaminele au fost clasificate drept potențial cancerigene pentru oameni, iar consumul pe termen lung de produse bogate în nitrat de sodiu și nitriți, din surse precum cele ultraprocesate, a fost asociat cu un risc crescut de dezvoltare a anumitor tipuri de cancer, în special cancerul colorectal.'},
    { name: 'nitrit de sodiu', group: 'Conservant', description: 'Nitritul de sodiu(E250) este un aditiv alimentar. În stomac, în prezenţa proteinelor, nitriţii formează nitrozamine, substanţe cu potenţial cancerigen. De asemeni, ei reacţionează cu hemoglobina, distrugând-o.'},
    { name: 'sucraloza', group: 'Îndulcitor', description: 'Sucraloza(E955) este un aditiv alimentar cu rol de îndulcitor, obţinut prin procedee chimice din zahărul obişnuit. fiind de 600 de ori mai dulce decât zahărul. Gustul sucralozei este identic cu cel al zahărului (exceptând o tentă răcoritoare, mentolată), neavând nevoie să fie combinată cu alţi îndulcitori. Numeroasele teste de laborator desfăşurate pe animale în ultimele două decenii nu au relevat cu certitudine vreun potenţial toxic, cancerigen, mutagen sau teratogen al sucralozei. Totuşi, datorită unor suspiciuni că aceasta produce modificări la nivelul timusului, splinei şi al limfocitelor, cercetările continuă.'},
    { name: 'tertbutilhidrochinona', group: 'Conservant', description: 'Este un aditiv alimentar din categoria antioxidanţilor sintetici, cu rol în prevenirea râncezirii grăsimilor. Se utilizează în diverse grăsimi animale sau vegetale, cât şi în amestecuri pentru patiserie, snacksuri, supe şi ciorbe instant, sosuri, fructe procesate, cereale preparate, suplimente nutritive, mirodenii, produse din carne, cartofi deshidrataţi, arome şi lapte praf. Acest aditiv are efect cancerigen cert la animalele de laborator, iar la om este responsabil de efecte secundare serioase, printre care reacţiile alergice, leziunile la nivel celular, inclusiv la nivelul ADN-ului, declanşarea unor procese tumorale gastrice etc.'},
    { name: 'tbhq', group: 'Conservant', description: 'Este un aditiv alimentar din categoria antioxidanţilor sintetici, cu rol în prevenirea râncezirii grăsimilor. Se utilizează în diverse grăsimi animale sau vegetale, cât şi în amestecuri pentru patiserie, snacksuri, supe şi ciorbe instant, sosuri, fructe procesate, cereale preparate, suplimente nutritive, mirodenii, produse din carne, cartofi deshidrataţi, arome şi lapte praf. Acest aditiv are efect cancerigen cert la animalele de laborator, iar la om este responsabil de efecte secundare serioase, printre care reacţiile alergice, leziunile la nivel celular, inclusiv la nivelul ADN-ului, declanşarea unor procese tumorale gastrice etc.'},
    { name: 'dioxid de titan', group: 'Colorant', description: 'Dioxidul de titan(E171) este un colorant artificial anorganic, insolubil de culoare albă cu stabilitate foarte bună la lumină, căldură, oxidare și schimbări de pH. Utilizarea dioxidului de titan (E171) ca aditiv alimentar este interzisă în statele membre ale Uniunii Europene începând din 2022 din cauza faptului că nu pot fi excluse preocupările legate de genotoxicitate, adică proprietatea substanței de a deteriora ADN-ul, materialul genetic al celulelor.'},
    { name: 'grasimi trans', group: 'Substitut de grăsime', description: 'Grăsimile trans artificiale sunt considerate cel mai periculos tip de grăsimi deoarece au efecte devastatoare asupra organismului uman. La fel ca grăsimile saturate în exces, grăsimile trans ridică nivelul colesterolului rău (LDL). Acizii trans mai au un efect nociv, însă, reducând concomitent nivelul colesterolului bun (HDL). Astfel apare riscul crescut de: infarct miocardic, accident vascular cerebral, diabet'},
];

export default unhealthyIngredients;