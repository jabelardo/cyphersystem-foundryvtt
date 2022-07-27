/**
* Extend the basic ActorSheet with some very simple modifications
* @extends {ActorSheet}
*/

import {
  chatCardMarkItemIdentified
} from "../utilities/chat-cards.js";

import {
  itemRollMacro,
  recursionMacro,
  tagMacro
} from "../macros/macros.js";

import {
  byNameAscending,
  bySkillRating,
  byArchiveStatus,
  byIdentifiedStatus
} from "../utilities/sorting.js";

import {useRecoveries} from "../utilities/actor-utilities.js";

export class CypherActorSheet extends ActorSheet {

  /** @override */
  async getData() {
    const data = super.getData();

    // Item Data
    data.itemLists = {};

    // Sheet settings
    data.sheetSettings = {};
    data.sheetSettings.isGM = game.user.isGM;
    data.sheetSettings.isLimited = this.actor.limited;
    data.sheetSettings.isObserver = !this.options.editable;
    data.sheetSettings.slashForFractions = game.settings.get("cyphersystem", "useSlashForFractions") ? "/" : "|";

    // Enriched HTML
    data.enrichedHTML = {};

    // --Notes and description
    data.enrichedHTML.notes = await TextEditor.enrichHTML(this.actor.system.notes, {async: true});
    data.enrichedHTML.description = await TextEditor.enrichHTML(this.actor.system.description, {async: true});

    data.enrichedHTML.itemDescription = {};
    data.enrichedHTML.itemLevel = {};
    data.enrichedHTML.itemDepletion = {};

    for (let i of this.actor.items) {
      data.enrichedHTML.itemDescription[i.id] = await TextEditor.enrichHTML(i.system.description, {async: true});
      data.enrichedHTML.itemLevel[i.id] = await TextEditor.enrichHTML(i.system.level, {async: true});
      data.enrichedHTML.itemDepletion[i.id] = await TextEditor.enrichHTML(i.system.depletion, {async: true});
    }

    // Prepare items and return
    this.cyphersystem(data);
    return data;
  }

  /**
  * Organize and classify Items for Character sheets.
  *
  * @param {Object} actorData The actor to prepare.
  *
  * @return {undefined}
  */
  cyphersystem(data) {
    const actorData = data.actor.system;
    const itemLists = data.itemLists;

    // Initialize containers
    const equipment = [];
    const abilities = [];
    const spells = [];
    const abilitiesTwo = [];
    const abilitiesThree = [];
    const abilitiesFour = [];
    const skills = [];
    const skillsTwo = [];
    const skillsThree = [];
    const skillsFour = [];
    const attacks = [];
    const armor = [];
    const lastingDamage = [];
    const powerShifts = [];
    const cyphers = [];
    const artifacts = [];
    const oddities = [];
    const teenSkills = [];
    const teenAbilities = [];
    const teenAttacks = [];
    const teenArmor = [];
    const teenLastingDamage = [];
    const materials = [];
    const ammo = [];
    const recursions = [];
    const tags = []

    // Iterate through items, allocating to containers
    for (let i of data.items) {
      // let item = i.system;
      i.img = i.img || DEFAULT_TOKEN;

      // Check for hidden item
      let hidden = false;
      if (actorData.settings.hideArchived && i.system.archived) hidden = true;

      // Check for roll button on level
      if (i.type == "cypher" || i.type == "artifact") {
        if (Roll.validate(i.system.level.toString()) && i.system.level && isNaN(i.system.level)) {
          i.system.rollForLevel = true;
        } else {
          i.system.rollForLevel = false;
        }
      }

      // Append to containers
      if (i.type === 'equipment' && !hidden) {
        equipment.push(i);
      }
      else if (i.type === 'ammo' && !hidden) {
        ammo.push(i);
      }
      else if (i.type === 'ability' && !hidden && !(i.system.sorting == "Spell" || i.system.sorting == "AbilityTwo" || i.system.sorting == "AbilityThree" || i.system.sorting == "AbilityFour")) {
        abilities.push(i);
      }
      else if (i.type === 'ability' && !hidden && i.system.sorting == "Spell") {
        spells.push(i);
      }
      else if (i.type === 'ability' && !hidden && i.system.sorting == "AbilityTwo") {
        abilitiesTwo.push(i);
      }
      else if (i.type === 'ability' && !hidden && i.system.sorting == "AbilityThree") {
        abilitiesThree.push(i);
      }
      else if (i.type === 'ability' && !hidden && i.system.sorting == "AbilityFour") {
        abilitiesFour.push(i);
      }
      else if (i.type === 'skill' && !hidden && !(i.system.sorting == "SkillTwo" || i.system.sorting == "SkillThree" || i.system.sorting == "SkillFour")) {
        skills.push(i);
      }
      else if (i.type === 'skill' && !hidden && i.system.sorting == "SkillTwo") {
        skillsTwo.push(i);
      }
      else if (i.type === 'skill' && !hidden && i.system.sorting == "SkillThree") {
        skillsThree.push(i);
      }
      else if (i.type === 'skill' && !hidden && i.system.sorting == "SkillFour") {
        skillsFour.push(i);
      }
      else if (i.type === 'attack' && !hidden) {
        attacks.push(i);
      }
      else if (i.type === 'armor' && !hidden) {
        armor.push(i);
      }
      else if (i.type === 'lasting Damage' && !hidden) {
        lastingDamage.push(i);
      }
      else if (i.type === 'power Shift' && !hidden) {
        powerShifts.push(i);
      }
      else if (i.type === 'cypher' && !hidden) {
        cyphers.push(i);
      }
      else if (i.type === 'artifact' && !hidden) {
        artifacts.push(i);
      }
      else if (i.type === 'oddity' && !hidden) {
        oddities.push(i);
      }
      else if (i.type === 'teen Skill' && !hidden) {
        teenSkills.push(i);
      }
      else if (i.type === 'teen Ability' && !hidden) {
        teenAbilities.push(i);
      }
      else if (i.type === 'teen Attack' && !hidden) {
        teenAttacks.push(i);
      }
      else if (i.type === 'teen Armor' && !hidden) {
        teenArmor.push(i);
      }
      else if (i.type === 'teen lasting Damage' && !hidden) {
        teenLastingDamage.push(i);
      }
      else if (i.type === 'material' && !hidden) {
        materials.push(i);
      }
      else if (i.type === 'recursion' && !hidden) {
        recursions.push(i);
      }
      else if (i.type === 'tag' && !hidden) {
        tags.push(i);
      }
    }

    // Sort by name
    equipment.sort(byNameAscending);
    abilities.sort(byNameAscending);
    abilitiesTwo.sort(byNameAscending);
    abilitiesThree.sort(byNameAscending);
    abilitiesFour.sort(byNameAscending);
    spells.sort(byNameAscending);
    skills.sort(byNameAscending);
    skillsTwo.sort(byNameAscending);
    skillsThree.sort(byNameAscending);
    skillsFour.sort(byNameAscending);
    attacks.sort(byNameAscending);
    armor.sort(byNameAscending);
    lastingDamage.sort(byNameAscending);
    powerShifts.sort(byNameAscending);
    cyphers.sort(byNameAscending);
    artifacts.sort(byNameAscending);
    oddities.sort(byNameAscending);
    teenSkills.sort(byNameAscending);
    teenAbilities.sort(byNameAscending);
    teenAttacks.sort(byNameAscending);
    teenArmor.sort(byNameAscending);
    teenLastingDamage.sort(byNameAscending);
    materials.sort(byNameAscending);
    ammo.sort(byNameAscending);
    recursions.sort(byNameAscending);
    tags.sort(byNameAscending);

    // Sort by skill rating
    if (this.actor.type == "PC" || this.actor.type == "Companion") {
      if (actorData.settings.skills.sortByRating) {
        skills.sort(bySkillRating);
        skillsTwo.sort(bySkillRating);
        skillsThree.sort(bySkillRating);
        skillsFour.sort(bySkillRating);
        teenSkills.sort(bySkillRating);
      }
    }

    // Sort by identified status
    cyphers.sort(byIdentifiedStatus);
    artifacts.sort(byIdentifiedStatus);

    // Sort by archive status
    equipment.sort(byArchiveStatus);
    abilities.sort(byArchiveStatus);
    abilitiesTwo.sort(byArchiveStatus);
    abilitiesThree.sort(byArchiveStatus);
    abilitiesFour.sort(byArchiveStatus);
    spells.sort(byArchiveStatus);
    skills.sort(byArchiveStatus);
    skillsTwo.sort(byArchiveStatus);
    skillsThree.sort(byArchiveStatus);
    skillsFour.sort(byArchiveStatus);
    attacks.sort(byArchiveStatus);
    armor.sort(byArchiveStatus);
    lastingDamage.sort(byArchiveStatus);
    powerShifts.sort(byArchiveStatus);
    cyphers.sort(byArchiveStatus);
    artifacts.sort(byArchiveStatus);
    oddities.sort(byArchiveStatus);
    teenSkills.sort(byArchiveStatus);
    teenAbilities.sort(byArchiveStatus);
    teenAttacks.sort(byArchiveStatus);
    teenArmor.sort(byArchiveStatus);
    teenLastingDamage.sort(byArchiveStatus);
    materials.sort(byArchiveStatus);
    ammo.sort(byArchiveStatus);
    recursions.sort(byArchiveStatus);
    tags.sort(byArchiveStatus);

    // Check for spells
    if (spells.length > 0) {
      actorData.showSpells = true;
    } else {
      actorData.showSpells = false;
    }

    // Check for ability category 2
    if (abilitiesTwo.length > 0) {
      actorData.showAbilitiesTwo = true;
    } else {
      actorData.showAbilitiesTwo = false;
    }

    // Check for ability category 3
    if (abilitiesThree.length > 0) {
      actorData.showAbilitiesThree = true;
    } else {
      actorData.showAbilitiesThree = false;
    }

    // Check for ability category 4
    if (abilitiesFour.length > 0) {
      actorData.showAbilitiesFour = true;
    } else {
      actorData.showAbilitiesFour = false;
    }

    // Check for skill category 2
    if (skillsTwo.length > 0) {
      actorData.showSkillsTwo = true;
    } else {
      actorData.showSkillsTwo = false;
    }

    // Check for skill category 3
    if (skillsThree.length > 0) {
      actorData.showSkillsThree = true;
    } else {
      actorData.showSkillsThree = false;
    }

    // Check for skill category 4
    if (skillsFour.length > 0) {
      actorData.showSkillsFour = true;
    } else {
      actorData.showSkillsFour = false;
    }

    // Assign and return
    itemLists.equipment = equipment;
    itemLists.abilities = abilities;
    itemLists.abilitiesTwo = abilitiesTwo;
    itemLists.abilitiesThree = abilitiesThree;
    itemLists.abilitiesFour = abilitiesFour;
    itemLists.spells = spells;
    itemLists.skills = skills;
    itemLists.skillsTwo = skillsTwo;
    itemLists.skillsThree = skillsThree;
    itemLists.skillsFour = skillsFour;
    itemLists.attacks = attacks;
    itemLists.armor = armor;
    itemLists.lastingDamage = lastingDamage;
    itemLists.powerShifts = powerShifts;
    itemLists.cyphers = cyphers;
    itemLists.artifacts = artifacts;
    itemLists.oddities = oddities;
    itemLists.teenSkills = teenSkills;
    itemLists.teenAbilities = teenAbilities;
    itemLists.teenAttacks = teenAttacks;
    itemLists.teenArmor = teenArmor;
    itemLists.teenLastingDamage = teenLastingDamage;
    itemLists.materials = materials;
    itemLists.ammo = ammo;
    itemLists.recursions = recursions;
    itemLists.tags = tags;
  }

  /**
  * Event Listeners
  */

  /** @override */
  async activateListeners(html) {
    super.activateListeners(html);

    html.find('.item-description').click(async clickEvent => {
      if (!game.keyboard.isModifierActive('Alt')) {
        const shownItem = $(clickEvent.currentTarget).parents(".item");
        const itemID = shownItem.data("itemId");

        if (game.user.expanded == undefined) {
          game.user.expanded = {};
        }

        if (game.user.expanded[itemID] == undefined || game.user.expanded[itemID] == false) {
          game.user.expanded[itemID] = true;
        } else {
          game.user.expanded[itemID] = false;
        }
        this._render(false);
      }
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    /**
    * Inventory management
    */

    // Add Inventory Item
    html.find('.item-create').click(clickEvent => {
      const itemCreatedPromise = this._onItemCreate(clickEvent);
      itemCreatedPromise.then(itemData => {
        this.actor.items.get(itemData.id).sheet.render(true);
      });
    });

    // Edit Inventory Item
    html.find('.item-edit').click(clickEvent => {
      this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId")).sheet.render(true);
    });

    // Mark Item Identified
    html.find('.identify-item').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));

      if (game.user.isGM) {
        item.update({"system.identified": true});
      } else {
        ChatMessage.create({
          content: chatCardMarkItemIdentified(this.actor, item),
          whisper: ChatMessage.getWhisperRecipients("GM"),
          blind: true
        })
      }
    });

    // Delete Inventory Item
    html.find('.item-delete').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
      if (game.keyboard.isModifierActive('Alt')) {
        item.delete();
      } else {
        let archived = (item.system.archived) ? false : true;
        item.update({"system.archived": archived});
      }
    });

    // Translate to recursion
    html.find('.item-recursion').click(async clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
      await recursionMacro(this.actor, item);
    });

    // (Un)Archive tag
    html.find('.item-tag').click(async clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
      await tagMacro(this.actor, item);
    });

    // Add to Quantity
    html.find('.plus-one').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
      let amount = (game.keyboard.isModifierActive('Alt')) ? 10 : 1;
      let newValue = item.system.quantity + amount;
      item.update({"system.quantity": newValue});
    });

    // Subtract from Quantity
    html.find('.minus-one').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
      let amount = (game.keyboard.isModifierActive('Alt')) ? 10 : 1;
      let newValue = item.system.quantity - amount;
      item.update({"system.quantity": newValue});
    });

    // Roll for level
    html.find('.rollForLevel').click(async clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
      let roll = await new Roll(item.system.level).evaluate({async: true});
      roll.toMessage({
        speaker: ChatMessage.getSpeaker(),
        flavor: game.i18n.format("CYPHERSYSTEM.RollForLevel", {item: item.name})
      });
      item.update({"system.level": roll.total});
    });

    /**
    * Roll buttons
    */

    // Item roll buttons
    html.find('.item-roll').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));

      itemRollMacro(this.actor, item.id, "", "", "", "", "", "", "", "", "", "", "", "", false, "")
    });

    // Item pay pool points buttons
    html.find('.item-pay').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));

      itemRollMacro(this.actor, item.id, "", "", "", "", "", "", "", "", "", "", "", "", true, "")
    });

    // Item cast spell button
    html.find('.cast-spell').click(clickEvent => {
      const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));

      let recoveryUsed = useRecoveries(this.actor, true);

      if (recoveryUsed == undefined) return;

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
        content: game.i18n.format("CYPHERSYSTEM.CastingASpell", {
          name: this.actor.name,
          recoveryUsed: recoveryUsed,
          spellName: item.name
        }),
        flags: {"itemID": item.id}
      });
    });

    /**
    * General sheet functions
    */

    // Send item description to chat
    html.find('.item-description').click(clickEvent => {
      if (game.keyboard.isModifierActive('Alt')) {
        const item = this.actor.items.get($(clickEvent.currentTarget).parents(".item").data("itemId"));
        if (item.system.identified === false) return ui.notifications.warn(game.i18n.localize("CYPHERSYSTEM.WarnSentUnidentifiedToChat"));
        let message = "";
        let brackets = "";
        let description = "<hr style='margin:3px 0;'><img class='description-image-chat' src='" + item.img + "' width='50' height='50'/>" + item.system.description;
        let points = "";
        let notes = "";
        let name = item.name;
        if (item.system.notes != "") notes = ", " + item.system.notes;
        if (item.type == "skill" || item.type == "teen Skill") {
          brackets = " (" + item.system.skillLevel + ")";
        } else if (item.type == "power Shift") {
          brackets = " (" + item.system.powerShiftValue + " " + game.i18n.localize("CYPHERSYSTEM.Shifts") + ")";
        } else if (item.type == "ability" || item.type == "teen Ability") {
          points = (item.system.costPoints == "1") ? " " + game.i18n.localize("CYPHERSYSTEM.Point") : " " + game.i18n.localize("CYPHERSYSTEM.Points");
          if (item.system.costPoints != 0 && item.system.costPoints != 0) brackets = " (" + item.system.costPoints + " " + item.system.costPool + points + ")";
        } else if (item.type == "attack") {
          points = (item.system.damage == 1) ? " " + game.i18n.localize("CYPHERSYSTEM.PointOfDamage") : " " + game.i18n.localize("CYPHERSYSTEM.PointsOfDamage");
          let damage = ", " + item.system.damage + " " + points;
          let attackType = item.system.attackType;
          let range = "";
          if (item.system.range != "") range = ", " + item.system.range;
          brackets = " (" + attackType + damage + range + notes + ")";
        } else if (item.type == "armor" || item.type == "teen Armor") {
          brackets = " (" + item.system.armorType + notes + ")";
        } else if (item.type == "lasting Damage") {
          let permanent = "";
          if (item.system.damageType == "Permanent") permanent = ", " + game.i18n.localize("CYPHERSYSTEM.permanent");
          brackets = " (" + item.system.lastingDamagePool + permanent + ")";
        } else {
          if (item.system.level != "") brackets = " (" + game.i18n.localize("CYPHERSYSTEM.level") + " " + item.system.level + ")";
        }
        message = "<b>" + item.type.capitalize() + ": " + name + "</b>" + brackets + description;
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker(),
          content: message
        });
      }
    });

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      // Find all items on the character sheet.
      html.find('li.item').each((i, li) => {
        // Ignore for the header row.
        if (li.classList.contains("item-header")) return;
        if (li.classList.contains("non-draggable")) return;
        if (li.classList.contains("item-settings")) return;
        // Add draggable attribute and dragstart listener.
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }

    /**
    * Health management for NPCs, Companions, and Communities
    */

    // Increase Health
    html.find('.increase-health').click(clickEvent => {
      let amount = (game.keyboard.isModifierActive('Alt')) ? 10 : 1;
      let newValue = this.actor.system.health.value + amount;
      this.actor.update({"system.health.value": newValue});
    });

    // Decrease Health
    html.find('.decrease-health').click(clickEvent => {
      let amount = (game.keyboard.isModifierActive('Alt')) ? 10 : 1;
      let newValue = this.actor.system.health.value - amount;
      this.actor.update({"system.health.value": newValue});
    });

    // Reset Health
    html.find('.reset-health').click(clickEvent => {
      this.actor.update({
        "system.health.value": this.actor.system.health.max
      })
    });
  }

  /**
  * Handle dropping of an item reference or item data onto an Actor Sheet
  * @param {DragEvent} event     The concluding DragEvent which contains drop data
  * @param {Object} data         The data transfer extracted from the event
  * @return {Promise<Object>}    A data object which describes the result of the drop
  * @private
  */
  async _onDropItem(event, data) {
    event.preventDefault();
    // Define items & actors
    const originItem = await Item.fromDropData(data);
    let originItemData = foundry.utils.deepClone(originItem.toObject());
    const originActor = originItem.actor;
    const targetActor = this.actor;
    const targetItem = targetActor.items.getName(originItem.name);

    // Define actor IDs
    const originActorID = (originActor) ? originActor.id : "";
    const targetActorID = (targetActor) ? targetActor.id : "";

    // Define item type categories
    const typesCharacterProperties = ["ability", "lasting Damage", "power Shift", "skill", "recursion", "tag", "teen Ability", "teen lasting Damage", "teen Skill"];
    const typesUniqueItems = ["armor", "artifact", "attack", "cypher", "oddity", "teen Armor", "teen Attack"];
    const typesQuantityItems = ["ammo", "equipment", "material"];

    // Return statements
    if (!targetActor.isOwner) return;
    if (originActorID == targetActorID) return;

    // Handle character properties
    if (typesCharacterProperties.includes(originItem.type)) {
      if (originActor || targetItem || !["PC", "Companion"].includes(targetActor.type)) return;
      targetActor.createEmbeddedDocuments("Item", [originItemData]);
      enableItemLists();
    };

    // Handle unique items
    if (typesUniqueItems.includes(originItem.type)) {
      if (originActor) {
        let d = new Dialog({
          title: game.i18n.localize("CYPHERSYSTEM.ItemShouldBeArchivedOrDeleted"),
          content: "",
          buttons: {
            move: {
              icon: '<i class="fas fa-archive"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Archive"),
              callback: (html) => archiveItem()
            },
            moveAll: {
              icon: '<i class="fas fa-trash"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Delete"),
              callback: (html) => deleteItem()
            },
            cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Cancel"),
              callback: () => { }
            }
          },
          default: "move",
          close: () => { }
        });
        d.render(true);
      } else {
        // Handle cypher & artifact identification from world items
        if (["cypher", "artifact"].includes(originItem.type)) {
          let identifiedStatus;
          if (game.settings.get("cyphersystem", "cypherIdentification") == 0) {
            identifiedStatus = (!game.keyboard.isModifierActive('Alt')) ? originItemData.system.identified : !originItemData.system.identified;
          } else if (game.settings.get("cyphersystem", "cypherIdentification") == 1) {
            identifiedStatus = (!game.keyboard.isModifierActive('Alt')) ? true : false;
          } else if (game.settings.get("cyphersystem", "cypherIdentification") == 2) {
            identifiedStatus = (!game.keyboard.isModifierActive('Alt')) ? false : true;
          }
          originItemData.system.identified = identifiedStatus;
        };

        // Create item
        targetActor.createEmbeddedDocuments("Item", [originItemData]);
      }
    };

    // Handle items with quantity
    if (typesQuantityItems.includes(originItem.type)) {
      let maxQuantity = originItem.system.quantity;
      if (maxQuantity <= 0 && maxQuantity != null) return ui.notifications.warn(game.i18n.localize("CYPHERSYSTEM.CannotMoveNotOwnedItem"));
      moveDialog();

      function moveDialog() {
        let d = new Dialog({
          title: game.i18n.format("CYPHERSYSTEM.MoveItem", {name: originItem.name}),
          content: createContent(),
          buttons: createButtons(),
          default: "move",
          close: () => { }
        });
        d.render(true);
      }

      function createContent() {
        let maxQuantityText = "";
        if (maxQuantity != null) maxQuantityText = `&nbsp;&nbsp;${game.i18n.localize("CYPHERSYSTEM.Of")} ${maxQuantity}`;
        let content = `<div align="center"><label style='display: inline-block; width: 98px; text-align: right'><b>${game.i18n.localize("CYPHERSYSTEM.Quantity")}/${game.i18n.localize("CYPHERSYSTEM.Units")}: </b></label><input name='quantity' id='quantity' style='width: 75px; margin-left: 5px; margin-bottom: 5px;text-align: center' type='number' value="1" />` + maxQuantityText + `</div>`;
        return content;
      };

      function createButtons() {
        if (maxQuantity == null) {
          return {
            move: {
              icon: '<i class="fas fa-share-square"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Move"),
              callback: (html) => moveItems(html.find('#quantity').val(), originItem)
            },
            cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Cancel"),
              callback: () => { }
            }
          }
        } else {
          return {
            move: {
              icon: '<i class="fas fa-share-square"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Move"),
              callback: (html) => moveItems(html.find('#quantity').val(), originItem)
            },
            moveAll: {
              icon: '<i class="fas fa-share-square"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.MoveAll"),
              callback: (html) => moveItems(maxQuantity, originItem)
            },
            cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("CYPHERSYSTEM.Cancel"),
              callback: () => { }
            }
          }
        }
      }

      function moveItems(quantity) {
        quantity = parseInt(quantity);
        if (originActor && (quantity > originItem.system.quantity || quantity <= 0)) {
          moveDialog(quantity);
          return ui.notifications.warn(game.i18n.format("CYPHERSYSTEM.CanOnlyMoveCertainAmountOfItems", {max: originItem.system.quantity}));
        }
        if (originActor) {
          let oldQuantity = parseInt(originItem.system.quantity) - quantity;
          originItem.update({"system.quantity": oldQuantity});
        }
        if (!targetItem) {
          originItemData.system.quantity = quantity;
          targetActor.createEmbeddedDocuments("Item", [originItemData]);
        } else {
          let newQuantity = parseInt(targetItem.system.quantity) + quantity;
          targetItem.update({"system.quantity": newQuantity});
        }
      }
    };

    async function enableItemLists() {
      if (originItem.type == "artifact") targetActor.update({"system.settings.equipment.artifacts": true});
      if (originItem.type == "cypher") targetActor.update({"system.settings.equipment.cyphers": true});
      if (originItem.type == "oddity") targetActor.update({"system.settings.equipment.oddities": true});
      if (originItem.type == "material") targetActor.update({"system.settings.equipment.materials": true});
      if (originItem.type == "ammo") targetActor.update({"system.settings.ammo": true});
      if (originItem.type == "power Shift") targetActor.update({"system.settings.powerShifts.active": true});
      if (originItem.type == "lasting Damage") targetActor.update({"system.settings.lastingDamage.active": true});
      if (originItem.type == "teen lasting Damage") targetActor.update({"system.settings.lastingDamage.active": true});
    };

    async function archiveItem() {
      originItem.update({"system.archived": true})
      targetActor.createEmbeddedDocuments("Item", [originItemData]);
      enableItemLists();
    };

    function deleteItem() {
      originItem.delete();
      targetActor.createEmbeddedDocuments("Item", [originItemData]);
      enableItemLists();
    }
  };

  /**
  * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
  * @param {Event} event   The originating click event
  * @private
  */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const types = {
      "ability": game.i18n.localize("CYPHERSYSTEM.NewAbility"),
      "ammo": game.i18n.localize("CYPHERSYSTEM.NewAmmo"),
      "armor": game.i18n.localize("CYPHERSYSTEM.NewArmor"),
      "artifact": game.i18n.localize("CYPHERSYSTEM.NewArtifact"),
      "attack": game.i18n.localize("CYPHERSYSTEM.NewAttack"),
      "cypher": game.i18n.localize("CYPHERSYSTEM.NewCypher"),
      "equipment": game.i18n.localize("CYPHERSYSTEM.NewEquipment"),
      "lasting Damage": game.i18n.localize("CYPHERSYSTEM.NewLastingDamage"),
      "material": game.i18n.localize("CYPHERSYSTEM.NewMaterial"),
      "oddity": game.i18n.localize("CYPHERSYSTEM.NewOddity"),
      "power Shift": game.i18n.localize("CYPHERSYSTEM.NewPowerShift"),
      "skill": game.i18n.localize("CYPHERSYSTEM.NewSkill"),
      "teen Ability": game.i18n.localize("CYPHERSYSTEM.NewTeenAbility"),
      "teen Armor": game.i18n.localize("CYPHERSYSTEM.NewTeenArmor"),
      "teen Attack": game.i18n.localize("CYPHERSYSTEM.NewTeenAttack"),
      "teen lasting Damage": game.i18n.localize("CYPHERSYSTEM.NewTeenLastingDamage"),
      "teen Skill": game.i18n.localize("CYPHERSYSTEM.NewTeenSkill"),
      "recursion": game.i18n.localize("CYPHERSYSTEM.NewRecursion"),
      "tag": game.i18n.localize("CYPHERSYSTEM.NewTag"),
      "default": game.i18n.localize("CYPHERSYSTEM.NewDefault")
    };
    const name = (types[type] || types["default"]);

    // Finally, create the item!
    return Item.create({type: type, data, name: name}, {parent: this.actor});
  }
}
