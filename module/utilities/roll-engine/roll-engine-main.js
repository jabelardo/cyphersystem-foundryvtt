import {rollEngineComputation} from "./roll-engine-computation.js";
import {rollEngineForm} from "./roll-engine-form.js";

export async function rollEngineMain(data) {
  data = Object.assign({
    actor: undefined,
    itemID: "",
    teen: undefined,
    skipDialog: !game.settings.get("cyphersystem", "itemMacrosUseAllInOne"),
    skipRoll: false,
    initiativeRoll: false,
    reroll: false,
    gmiRange: undefined,
    title: "",
    pool: "Pool",
    skillLevel: 0,
    assets: 0,
    effortToEase: 0,
    effortOtherUses: 0,
    damage: 0,
    effortDamage: 0,
    damagePerLOE: 0,
    difficultyModifier: 0,
    easedOrHindered: "eased",
    bonus: 0,
    poolPointCost: 0
  }, data);

  if (!data.actor) data.actor = game.user.character;

  // Check for PC actor
  if (!data.actor || data.actor.type != "pc") return ui.notifications.warn(game.i18n.localize("CYPHERSYSTEM.MacroOnlyAppliesToPC"));

  // Check whether pool == XP
  if (data.pool == "XP" && !data.skipDialog) return ui.notifications.warn(game.i18n.localize("CYPHERSYSTEM.CantUseAIOMacroWithAbilitiesUsingXP"));

  // Set defaults for functions
  if (data.teen === undefined) {
    data.teen = (data.actor.system.basic.unmaskedForm == "Teen") ? true : false;
  }
  data.skipDialog = (game.keyboard.isModifierActive('Alt')) ? !data.skipDialog : data.skipDialog;
  data.initiativeRoll = (data.actor.items.get(data.itemID)) ? data.actor.items.get(data.itemID).system.settings.general.initiative : false;

  // Set GMI Range
  if (data.gmiRange === undefined) {
    if (game.settings.get("cyphersystem", "useGlobalGMIRange")) {
      data.gmiRange = game.settings.get("cyphersystem", "globalGMIRange");
    } else if (!game.settings.get("cyphersystem", "useGlobalGMIRange")) {
      data.gmiRange = data.actor.system.basic.gmiRange;
    }
  }

  // Set default basic modifiers
  if (data.skillLevel == "Specialized") data.skillLevel = 2;
  if (data.skillLevel == "Trained") data.skillLevel = 1;
  if (data.skillLevel == "Practiced") data.skillLevel = 0;
  if (data.skillLevel == "Inability") data.skillLevel = -1;

  // Go to the next step after checking whether dialog should be skipped
  if (!data.skipDialog) {
    rollEngineForm(data);
  } else if (data.skipDialog) {
    rollEngineComputation(data);
  }
}