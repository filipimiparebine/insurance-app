 Întrebări pentru tatăl tău (priorizate după impact)                                                    
                                                                                                         
  1. Autorizație ASF — broker propriu vs asistent în brokeraj? ⚠️  CRITIC
                                                                                                         
  Context plan: Am asumat că ești "broker autorizat ASF: RBK-XXX" (vezi footer documentat).              
                                                                                                         
  Realitate piață: EMAG operează ca "asistent în brokeraj al Safety Broker" (RBK-293), NU broker propriu.
   = model mult mai simplu juridic + capital.                      
                                                                                                         
  Întrebări concrete:                                                                                    
  - Care e diferența legală între broker autorizat ASF și asistent în brokeraj?
  - Capital social minim cerut ASF pentru broker propriu? (am citit ~25.000-50.000 EUR — corect?)        
  - Asigurare de răspundere profesională (E&O) — cât costă anual la un broker mic?               
  - Pregătire profesională specifică ASF — câte ore + cost?                                              
  - Timpul realist de obținere autorizație ASF de la 0?                                                  
  - Dacă e prea complicat: poți opera ca asistent în brokeraj sub Safety Broker (similar EMAG)?          
  Avantaje/dezavantaje? Ce comision pierzi?                                                              
                                                                                                         
  Impact pe plan: dacă mergi pe asistent în brokeraj, schimbă footer + DPO + structura juridică în doc.  
  Lansare cu 6+ luni mai rapid.                                                                          
                                                                   
  ---                                                                                                    
  2. Comision broker real — practică RO 💰                         
                                                                                                         
  Context plan: Am asumat comision flat 5% în UI și DB (broker_commission_pct: 5.0).
                                                                                                         
  Întrebări:                                                       
  - Comisionul real pe RCA în piața RO — range realist? (5-15%? 20%?)                                    
  - Variază per asigurător sau e standard?                                                               
  - Volum tiers — câte polițe/lună unlock comision mai mare?
  - Dacă mergi prin Safety Broker (sub-broker) — ei iau ce procent din comision? Tu rămâi cu cât?        
  - Există clawback (dacă user anulează în 14 zile, broker pierde tot comisionul)?                       
  - Comision diferit pe RCA vs CASCO vs locuință?                                                        
                                                                                                         
  Impact: ajustare config DB + projection P&L + modelarea coupon/discount din Q28.3.                     
                                                                                                         
  ---                                                                                                    
  3. Claims handling — responsabilitatea broker la daună 📞                                              
                                                                                                         
  Context plan: Am acoperit doar emiterea + anularea. NU am atins ce face user-ul la daună.
                                                                                                         
  Întrebări:                                                       
  - User a cumpărat RCA prin tine. Are accident. Unde sună prima oară?                                   
  - Tu ca broker ai responsabilitate să-l ajuți, sau e 100% asigurător?                                  
  - Practica brokerilor mari RO (PrețulMeu, etc.) — ofera "asistență la daună" ca diferentiator?
  - Trebuie un buton "Raportează daună" în cont user, sau redirect la asigurător?                        
  - Există SLA contractual cu asigurătorul cu privire la daune?                                          
                                                                                                         
  Impact: poate adaug pagină /cont/raporteaza-dauna cu workflow. Sau cel puțin link telefon/contact      
  asigurător per poliță în cont.                                                                         
                                                                                                         
  ---                                                                                                    
  4. Bonus-Malus practica reală 📊                                 
                                                                                                         
  Context plan: Am presupus toate ofertele afișează "Clasa B6" generic. CEDAM = mocked v1.
                                                                                                         
  Întrebări:                                                       
  - Asigurătorii folosesc strict CEDAM, sau au algoritmi proprii?                                        
  - User cu istoric daune mai vechi (>5 ani) — încă afectează clasa?                                     
  - User schimbă mașina — clasa se transferă sau pleacă din B0?     
  - Adăugarea de șoferi noi cu istoric ridicat — chiar afectează prețul, sau e doar declarativ?          
  - Există API real BAAR pentru lookup clasă, sau doar manual?                                           
                                                                                                         
  Impact: simplificare/complicare pas 4 oferte. Poate trebuie afișare clasă per șofer, nu doar global.   
                                                                                                         
  ---                                                                                                    
  5. BAAR risc ridicat — chiar e business opportunity? 🎯                                                
                                                                                                         
  Context plan: Am marcat redirect static către baar.ro, fără emitere automată.
                                                                                                         
  Întrebări:                                                       
  - Ce procent din populația RO se încadrează la "risc ridicat" realist?                                 
  - Cum funcționează concret procesul BAAR — user trimite cerere, BAAR alocă asigurător forțat, user     
  plătește la asigurător?                                                                           
  - Tu broker poți emite poliță BAAR-alocată? Sau e direct user ↔ asigurător?                            
  - Comisionul broker e tot 5% sau diferit pentru BAAR?                      
  - Tarif BAAR e fix sau variază? Mai scump decât piața liberă cu cât?                                   
  - Există brokeri RO specializați doar pe risc ridicat = niche oportunitate?                            
                                                                                                         
  Impact: dacă tu poți emite BAAR cu comision normal, e nouă revenue stream și schimbă din "redirect" în 
  "feature dedicated".                                                                                   
                                                                                                         
  ---                                                                                                    
  6. Cesiune poliță — frecvență realistă 🔄                        
                                                                                                         
  Context plan: Am marcat out of scope v1 (manual prin support).
                                                                                                         
  Întrebări:                                                       
  - Câte cesiuni se fac realist per 100 polițe RCA emise / an? (10? 20%?)                                
  - Dacă procent mare → poate trebuie self-service v1.                                                   
  - Procesul real cu asigurătorul — durata, documente, restricții?
  - Practica concurenței (PrețulMeu etc.)?                                                               
                                                                                                         
  Impact: poate ajustăm scope v1 dacă cesiunile sunt frecvente.                                          
                                                                                                         
  ---                                                                                                    
  7. IPID — ce e și când îl afișezi? 📋                                                                  
                                                                                                         
  Context plan: Am pus ipid_url ca link la oferte și pe poliță emisă.
                                                                                                         
  Întrebări:                                                       
  - IPID = "Insurance Product Information Document". Cine îl generează — ASF, asigurător, sau standard pe
   industrie?                                                                                            
  - E obligatoriu să-l afișezi user-ul înainte de cumpărare, sau doar la cerere?
  - Practica RO — competiția cum îl afișează?                                                            
  - Dacă e diferit per asigurător, tu îl primești prin API sau îl găzduiești tu?                         
                                                                                                         
  Impact: poate trebuie modal "Citește IPID înainte de plată" obligatoriu — affects UX checkout.         
                                                                                                         
  ---                                                                                                    
  8. Plată rate prin TBI Bank — relevant v1? 💳                                                          
                                                                                                         
  Context plan: Am marcat out v1, plata în rate v2.
                                                                                                         
  Întrebări:                                                       
  - Pe RCA, ce procent useri preferă rate vs plată integrală în RO?                                      
  - TBI Bank comision pentru broker — ce iei tu, ce ia TBI?                                              
  - Onboarding TBI Bank cât durează?                       
  - PrețulMeu a făcut din asta diferentiator — chiar adaugă conversion?                                  
                                                                                                         
  Impact: dacă conversion uplift mare (>20%), poate revin la decizie și includem v1.                     
                                                                                                         
  ---                                                                                                    
  9. Reglementare ASF — raportări periodice obligatorii 📑                                               
                                                                                                         
  Context plan: Am acoperit doar partea consumer-facing. NU am acoperit raportările tale către ASF.
                                                                                                         
  Întrebări:                                                                                             
  - Ce raportări obligatorii trebuie să faci ASF? (Lunare? Trimestriale? Anuale?)                        
  - Format raportări — Excel, XML, prin portal?                                                          
  - Conținut — volume polițe, comision, daune raportate, anulări?  
  - ASF inspecție pe broker mic — frecvență, ce verifică?                                                
  - KYC/AML la tranzacții > prag (2.300 EUR?) — există obligație pentru broker pe RCA?                   
                                                                                                         
  Impact: poate trebuie pagina "Raportări ASF" în admin Refine cu export-uri specifice.                  
                                                                                                         
  ---                                                                                                    
  10. Diferențe practice între cei 9 asigurători 🏢                                                      
                                                                                                         
  Context plan: Am tratat toți 9 ca egal-relevanți în UI.
                                                                                                         
  Întrebări:                                                       
  - Care din cei 9 au market share major în RO RCA (top 3?)?                                             
  - Există asigurători "premium" (Allianz, Generali) vs "ieftini" (eazy.insure, Hellas Direct) cu pattern
   stabil?                                                                                               
  - Care asigurători nu acceptă brokeri noi sau au criterii grele?                                       
  - User RO tipic — preferă brand cunoscut sau preț?               
  - Există asigurători care plătesc daunele lent / prost — relevant la cross-sell sau direcționare user? 
                                                                                                         
  Impact: poate ordine default sortare în UI = brand-ranked, nu doar preț. Sau filter "Recomandate" pe   
  asigurători cu reputație daune bună.                                                                   
                                                                                                         
  ---                                                                                                    
  Întrebări bonus (mai puțin critice dar utile)                    
                                                                                                         
  11. Carte verde non-UE — practică reală? Câți useri RO călătoresc în țările excluse (AZ/BY/IR/RUS/UA)?
  Cum se emite carte verde extra?                                                                        
  12. Re-emitere poliță pierdută — user pierde PDF, vine la tine. Tu poți re-emite din S3 propriu, sau
  trebuie cere de la asigurător? Cost?                                                                   
  13. Cross-sell timing — practică piață: la cât timp de la RCA face sens să trimiți ofertă CASCO? 1
  lună? 3 luni? La reînnoire?                                                                            
  14. Documente justificative ("în vederea înmatriculării" pas 1) — practica reală: care sunt cele mai
  des refuzate de asigurători din cele 3 sub-cazuri?                                                     
  15. Decontare directă — câți useri o cer realist? Worth it ca toggle global?
  16. Polița în EN pentru expați — există asigurători care emit RCA bilingv RO+EN, sau doar RO?          
                                                                                                         
  ---                                                                                                    
  Recomandare strategică                                                                                 
                                                                   
  Top 3 cu impact maxim asupra planului dacă sunt clarificate:
                                                                                                         
  1. #1 Autorizație ASF — schimbă fundația juridică. Dacă mergi asistent în brokeraj sub Safety Broker,  
  lansezi cu 6+ luni mai rapid + capital mai mic.                                                        
  2. #2 Comision broker real — afectează viability business + projection P&L.                            
  3. #3 Claims handling — feature gap probabil în plan.                                                  
                                                                                                         
  Restul = ajustări fine, dar valoroase.                                                                 
                                                                                                         
  Întrebare la tatăl tău: roagă-l să răspundă prima oară doar pe #1, #2, #3. Restul după ce ai           
  clarificarea celor 3 fundamentale.     