'use script';

const dynamo = require('');
const Ajv = require('ajv');

module.exports = {
    createFamily: async (familyData) => {
        const shortid = require('shortid');
        const familySchema = require('../schemas/familySchema');

        familyData.id = shortid.generate();
        familyData.isActive = 1;

        try {
            const ajv = new Ajv();
            let valid = ajv.validate(familySchema, familyData);

            if (!valid) {
                console.log('Creating Family - Invalid Family Format: ' + ajv.errorsText());
                throw new error("Creating Family - Invalid Family Format");
            }
        } catch (err) {
            console.error('Failed to perform validation on family data: ' + err);
            throw('Failed to perform validation on family data');
        }

        try {
            const dynamoResponse = await dynamo.saveFamily(familyData);
            return dynamoResponse;
        } catch (err) {
            console.error('Failed to save family to data table: ' + err);
            throw('Failed to save family to data table');
        }
    },
    getFamilyByFamilyId: async (familyId) => {
        if (familyId instanceof String) {
            throw("Request must include a string for MemberId");
        }

        try {
            const family = await dynamo.getFamilyByFamilyId(familyId);
            return family;
        } catch (err) {
            console.error("Error: " + err);
            throw("Failed to get Family");
        }
    },
    listFamilysByMemberId: async (memberId) => {
        if (typeof memberId !== "string") {
            throw("Request must include a string for memberId");
        }

        try {
            const family = await dynamo.listFamilysByMemberId(memberId);
            return family;
        } catch (err) {
            console.error("Error: " + err);
            throw("Failed to get Family by memberId");
        }
    },
    updateFamily: async (familyData) => {
        const familySchema = require("../schemas/familySchema");

        try {
            const ajv = new Ajv();
            let valid = ajv.validate(familySchema, familyData);

            if (!valid) {
                console.error("Updating Family - Invalid Family Format: " + ajv.errorsText);
                throw("Updating Family - Invalid Family Format");
            }
        } catch (err) {
            console.error("Error Validating Family Data: " + err);
            throw("Error validating family data");
        }

        try {
            const dynamoResponse = await dynamo.saveFamily(familyData);
            return dynamoResponse;
        } catch (err) {
            console.error("Updating family error: " + err);
            throw("Failed to update family");
        }
    },
    deleteFamily: async (familyId) => {
        try {
            const family = await dynamo.getFamilyByFamilyId(familyId);
            family.isActive = 0;

            const dynamoResponse = await dynamo.saveFamily(family);
            return dynamoResponse;
        } catch (err) {
            console.error("Family inactive error/Delete error: " + err);
            throw("Error deleting family");
        }
    }
};