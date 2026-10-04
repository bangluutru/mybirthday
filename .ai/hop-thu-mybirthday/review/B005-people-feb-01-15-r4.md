KET_QUA: SUA

# B005 review r4 — six unstable BnF URLs

Full r4 audit: 534 checked, 1 failed (BnF Simone de Beauvoir), 0 MANUAL. Repeated BnF failures differ across real HTTP runs. Authorize exactly the following six replacements in src/data/people/01.ts; every fact and every other source remains unchanged. Actual full dates were read from the replacement bodies (SNL Mishima year-only page and generic Colette name page rejected).

- simone-de-beauvoir: https://catalogue.bnf.fr/ark:/12148/cb11890854p → https://snl.no/Simone_de_Beauvoir; full DOB 1908-01-09; excerpt `9. januar 1908`.
- charles-perrault: https://catalogue.bnf.fr/ark:/12148/cb119192165.public → https://snl.no/Charles_Perrault; full DOB 1628-01-12; excerpt `12. januar 1628`.
- yukio-mishima: https://catalogue.bnf.fr/ark:/12148/cb119162858 → https://www.mishimayukio.jp/about/; full DOB 1925-01-14; excerpt `大正14年（1925）1月14日`.
- stendhal: https://catalogue.bnf.fr/ark:/12148/cb119255047 → https://snl.no/Stendhal; full DOB 1783-01-23; excerpt `23. januar 1783`.
- colette: https://catalogue.bnf.fr/ark:/12148/cb119298072 → https://snl.no/Sidonie_Gabrielle_Colette; full DOB 1873-01-28; excerpt `28. januar 1873`.
- romain-rolland: https://catalogue.bnf.fr/ark:/12148/cb11922460q → https://snl.no/Romain_Rolland; full DOB 1866-01-29; excerpt `29. januar 1866`.

Preserve hashes/excerpts/publisher metadata, exact baseline comparison for all 123 original records allowing only these six and the r2 Woolf URL. Run full gates to zero failed / zero MANUAL before DAT or push. No B006 until DAT.
