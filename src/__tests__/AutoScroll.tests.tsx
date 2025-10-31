import { mount } from 'enzyme';
import React from 'react';

import AutoScroll from '../AutoScroll';

describe('<AutoScroll />', () => {
  it('should render without errors', () => {
    const wrapper = mount(
      <AutoScroll>
        <p>test</p>
      </AutoScroll>,
    );

    expect(wrapper).toBeDefined();
  });

  it('should render the children that get passed in', () => {
    const count = 10;
    const text = [...Array(count)].reduce((acc, next, index) => `${acc}${index}`, '');
    // eslint-disable-next-line react/no-array-index-key
    const children = [...Array(count)].map((_, n) => <div key={n}>{n}</div>);
    const wrapper = mount(<AutoScroll>{children}</AutoScroll>);
    const container = wrapper.find('.react-auto-scroll__scroll-container');

    expect(container.children().length).toBe(count);
    expect(container.text()).toStrictEqual(text);
  });

  it('should handle the className prop correctly', () => {
    const wrapper = mount(
      <AutoScroll className="test-class">
        <p>test</p>
      </AutoScroll>,
    );

    expect(wrapper.hasClass('test-class')).toBe(true);
  });

  it('should handle the height prop correctly', () => {
    const wrapper = mount(
      <AutoScroll height={10}>
        <p>test</p>
      </AutoScroll>,
    );

    expect(wrapper.find('.react-auto-scroll__scroll-container').prop('style')).toMatchObject({
      height: 10,
    });
  });

  it('should handle the optionText prop correctly', () => {
    const wrapper = mount(
      <AutoScroll optionText="test string">
        <p>test</p>
      </AutoScroll>,
    );

    expect(wrapper.find('.react-auto-scroll__option-text').text()).toStrictEqual('test string');
  });

  it('should handle the preventInteraction prop correctly', () => {
    const wrapper = mount(
      <AutoScroll preventInteraction>
        <p>test</p>
      </AutoScroll>,
    );

    expect(wrapper.find('.react-auto-scroll__scroll-container').prop('style')).toMatchObject({
      pointerEvents: 'none',
    });
    expect(
      wrapper.find('.react-auto-scroll').hasClass('react-auto-scroll--prevent-interaction'),
    ).toBe(true);
    expect(wrapper.find('.react-auto-scroll__option').length).toBe(0);
  });

  it('should handle the showOption prop correctly', () => {
    const wrapper = mount(
      <AutoScroll showOption={false}>
        <p>test</p>
      </AutoScroll>,
    );

    expect(wrapper.find('.react-auto-scroll__scroll-container').prop('style')).toMatchObject({
      pointerEvents: 'auto',
    });
    expect(wrapper.find('.react-auto-scroll__option').length).toBe(0);
  });

  it('should handle the scrollBehavior prop correctly', () => {
    const wrapper = mount(
      <AutoScroll scrollBehavior="auto">
        <p>test</p>
      </AutoScroll>,
    );
    expect(wrapper.find('.react-auto-scroll__scroll-container').prop('style')).toMatchObject({
      scrollBehavior: 'auto',
    });
  });

  it('should accept controlled state', () => {
    const setAutoScroll = jest.fn();

    const wrapper = mount(
      <AutoScroll showOption={false} autoScroll setAutoScroll={setAutoScroll}>
        <div>item 1</div>
      </AutoScroll>,
    );

    const container = wrapper.find('.react-auto-scroll__scroll-container');
    const node = container.getDOMNode() as HTMLDivElement;

    Object.defineProperty(node, 'offsetHeight', { value: 100, configurable: true });
    Object.defineProperty(node, 'scrollHeight', { value: 200, configurable: true });
    Object.defineProperty(node, 'scrollTop', { value: 0, writable: true, configurable: true });

    // Simulate user scroll
    container.simulate('wheel');
    expect(setAutoScroll).toHaveBeenCalled();

    // Verify scroll-to-bottom happens when autoScroll is true
    wrapper.setProps({
      children: (
        <>
          <div>item 1</div>
          <div>item 2</div>
        </>
      ),
    });
    wrapper.update();

    expect(node.scrollTop).toBe(node.scrollHeight);
  });
});
