import React, { Fragment, useState } from 'react';
import { observer, inject } from "mobx-react";
import { List, ListItem, Segmented, Button, Toggle, BlockTitle } from 'framework7-react';
import { useTranslation } from 'react-i18next';

const EditHeader = props => {
    const { t } = useTranslation();
    const _t = t('Edit', {returnObjects: true});
    const headerObject = props.storeFocusObjects.headerObject;
    const isDiffFirst = headerObject.get_DifferentFirst();
    const isDiffOdd = headerObject.get_DifferentEvenOdd();
    const linkToPrev = headerObject.get_LinkToPrevious();
    const boolLinkToPrev = !!linkToPrev;
    const startPageNumber = headerObject.get_StartPageNumber();
    let _startAt = 1;
    if (startPageNumber >= 0) {
        _startAt = startPageNumber;
    }
    return (
        <Fragment>
            <List>
                <ListItem title={_t.textDifferentFirstPage}>
                    <Toggle checked={isDiffFirst} onToggleChange={() => {props.onDiffFirst(!isDiffFirst)}}/>
                </ListItem>
                <ListItem title={_t.textDifferentOddAndEvenPages}>
                    <Toggle checked={isDiffOdd} onToggleChange={() => {props.onDiffOdd(!isDiffOdd)}}/>
                </ListItem>
                <ListItem title={_t.textLinkToPrevious} className={linkToPrev===null ? 'disabled' : ''}>
                    <Toggle checked={boolLinkToPrev} onToggleChange={() => {props.onSameAs(!boolLinkToPrev)}}/>
                </ListItem>
            </List>
            <BlockTitle>{_t.textPageNumbering}</BlockTitle>
            <List>
                <ListItem title={_t.textContinueFromPreviousSection}>
                    <Toggle checked={startPageNumber<0} onToggleChange={() => {props.onNumberingContinue(!(startPageNumber<0), _startAt)}}/>
                </ListItem>
                <ListItem title={_t.textStartAt} className={startPageNumber<0 ? 'disabled' : ''}>
                    <div slot='after-start'>{_startAt}</div>
                    <div slot='after'>
                        <Segmented>
                            <Button outline className='decrement' onClick={() => {props.onStartAt(_startAt, true)}}> - </Button>
                            <Button outline className='increment' onClick={() => {props.onStartAt(_startAt, false)}}> + </Button>
                        </Segmented>
                    </div>
                </ListItem>
            </List>
        </Fragment>
    )
};

export default inject("storeFocusObjects")(observer(EditHeader));