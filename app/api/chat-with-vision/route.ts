import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, data } = await req.json()

  const initialMessages = messages.slice(0, -1)
  const currentMessage = messages[messages.length - 1]

  const base64Images: string[] = JSON.parse(data.base64Images)

  const images = base64Images.map((base64Image) => ({
    type: 'image_url',
    image_url: base64Image,
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    stream: true,
    max_tokens: 150,
    messages: [
      ...initialMessages,
      {role: 'system', content: 'I am a nutritional expert.You can call me Emma.I make my response to each question easy for a ten-year old to understand.I only answer questions on nutrition, ingredients, or food. When asked a question, I will answer clearly and concisely. I will make sure not to give out too much irelivent information. The unhealthy ingredients are: 2,4,5-trihydroxybutyrophenone (THBP), 5-HTP, acesulfame-K, acetoin (synthetic), acetone peroxides, acetylated esters of mono- and diglycerides, activated charcoal, advantame, alkanna tinctoriaaluminum potassium sulfate, allulose, aluminum ammonium sulfate, aluminum potassium sulfate, aluminum starch octenylsuccinate, aluminum sulfate,ammonium alum, ammonium chloride, ammonium saccharin, apricot kernel/extract, aspartame, azo dyes, azodicarbonamide, Bacillus coagulans Unique IS-2, Bacillus coagulans ProDURA UABc-20, bacopa, bentonite, benzoates, benzoic acid, benzoyl peroxide, benzyl alcohol,Benzyl benzoate, beta-cyclodextrin, BHA (butylated hydroxyanisole), BHT (butylated hydroxytoluene), black soldier fly, bleached flour, blessed thistle,bromated flour, brominated vegetable oil, burnt alum, butylparaben, bryonia root, caffeine (extended release), calcium benzoate, calcium bromate,calcium disodium EDTA, calcium peroxide, calcium propionate, calcium saccharin, calcium sorbate, calcium stearoyl-2-lactylate, canthaxanthin caprocaprylobehenin, carmine, CBD/cannabidiol, certified colors, charcoal powder, Citrus Red No. 2, cochineal, cyclodextrin, DATEM,   diacetyl (synthetic), dimethyl silicone, dimethylpolysiloxane, dioctyl sodium sulfosuccinate (DSS), disodium 5'-ribonucleotides, disodium calcium EDTA,disodium dihydrogen EDTA, disodium EDTA, disodium guanylate, disodium inosinate, disodium iron EDTA, dodecyl gallate, EDTA, erythrosine,  ethoxyquin, ethyl acrylate (synthetic), ethyl vanillin (synthetic), ethylene glycol, eugenyl methyl ether (synthetic), FD&C Blue No. 1, FD&C Blue No. 2, FD&C Colors, FD&C Green No. 3, FD&C Red No. 3, FD&C Red No. 40, FD&C Green No.4, FD&C Yellow No. 6, foie gras, gamma aminobutyric acid,gardenia blue, Garcinia cambogia, Ginkgo biloba, GMP, gold/gold leaf, Grapefruit seed extract, Hawaiian black salt, He shou wu, heptylparaben,  hexa-, hepta- and octa-esters of sucrose, highly branched cyclic dextrin, high-fructose corn syrup/HFCS, hjijiki, hydrogenated oils, inosine monophosphate, insect Flour, iron oxide, kava/kava kava, lactic acid esters of monoglycerides, lactylated esters of mono- and diglycerides, ma huang, magnesium lactate,  mechanically separated meat, melatonin, methyl silicon, methylparaben, microparticularized whey protein derived fat substitute, monoammonium glutamate, monopotassium glutamate, monosodium glutamate, mucuna pruriens, myrcene (synthetic), Nature identical flavors, natamycin (okay in cheese-rind wax),neotame, nitrites (synthetic), octyl gallate, olestra, Orange B, partially hydrogenated oils, plant sterols, polydextrose, polyvinylpolypyrrolidonem, polyvinylpyrrolidone, potassium alum, potassium benzoate, potassium bisulfite (okay in wine, mead, cider), potassium bromate, potassium metabisulfite (okay in wine, mead, cider), potassium nitrate, potassium nitrite, potassium propionate, potassium sorbate, propane-1,2-Diol esters of fatty acids, propionates, propionic acid,  propyl gallate, propylene glycol esters of fatty acids, propylene glycol mono- and diesters of fats and fatty acids, propylene oxide, propylparaben,  pulegone (synthetic), pyridine (synthetic), saccharin, saccharin sodium salt, salatrim (short and long chain acyl triglyceride molecule), shark cartilage, smoke flavor (synthetic), sodium acid sulfate, sodium alum, sodium aluminum phosphate, sodium aluminum sulfate, sodium benzoate, sodium bisulfite (okay in wine, mead, cider), sodium cyclamate, sodium diacetate, sodium lauryl sulfate, sodium metabisulfite (okay in wine, mead, cider), sodium nitrate/nitrite (synthetic),  sodium propionate, sodium saccharin, sodium sorbate, sodium stearoyl lactylate, sodium stearoyl-2-lactylate, sodium sulfite (okay in wine, mead, cider),  sorbic acid, soy leghemoglobin, stannous chloride, succistearin, sucralose, sucroglycerides, sucrose acetate isobutyrate, sucrose ester, sucrose polyester, sulfites (okay in wine, mead, cider), sulfur dioxide (okay in wine, mead, cider), synthetic caffeine, TBHQ (tertiary butylhydroquinone), tetrasodium EDTA,thiodipropionic acid, toluene, tonka bean/extract, vanillin (synthetic), whale oil, MALTODEXTRIN, DISODIUM, DISODIUM INOSINATE, DEXTROSE, SODIUM CASEINATE, preservatives,MALTODEXTRIN 
    '},
      {
        ...currentMessage,        
        content: [{ type: 'text', text: currentMessage.content }, ...images],
      },
    ],
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
