"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
/**
 * Base CSS class.
 * @private
 */
const baseClass = 'react-auto-scroll';
/**
 * Get a random string.
 * @private
 */
const getRandomString = () => Math.random()
    .toString(36)
    .substring(2, 15);
/**
 * AutoScroll component.
 */
exports.default = ({ checkBoxId = getRandomString(), children, className, height, optionText = 'Auto scroll', preventInteraction = false, showOption = true, }) => {
    const [autoScroll, setAutoScroll] = react_1.default.useState(true);
    const containerEl = react_1.default.useRef(null);
    const cls = classnames_1.default(baseClass, className, {
        [`${baseClass}--empty`]: react_1.default.Children.count(children) === 0,
        [`${baseClass}--prevent-interaction`]: preventInteraction,
        [`${baseClass}--showOption`]: showOption,
    });
    const style = {
        height,
        overflow: 'auto',
        scrollBehavior: 'auto',
        pointerEvents: preventInteraction ? 'none' : 'auto',
    };
    // Handle mousewheel events on the scroll container.
    const onWheel = () => {
        const { current } = containerEl;
        if (current && showOption) {
            setAutoScroll(current.scrollTop + current.offsetHeight === current.scrollHeight);
        }
    };
    // Apply the scroll behavior property after the first render,
    // so that the initial render is scrolled all the way to the bottom.
    react_1.default.useEffect(() => {
        setTimeout(() => {
            const { current } = containerEl;
            if (current) {
                current.style.scrollBehavior = 'smooth';
            }
        }, 0);
    }, [containerEl]);
    // When the children are updated, scroll the container
    // to the bottom.
    react_1.default.useEffect(() => {
        if (!autoScroll) {
            return;
        }
        const { current } = containerEl;
        if (current) {
            current.scrollTop = current.scrollHeight;
        }
    }, [children, containerEl, autoScroll]);
    return (react_1.default.createElement("div", { className: cls },
        react_1.default.createElement("div", { className: `${baseClass}__scroll-container`, onWheel: onWheel, ref: containerEl, style: style }, children),
        showOption && !preventInteraction && (react_1.default.createElement("div", { className: `${baseClass}__option` },
            react_1.default.createElement("input", { checked: autoScroll, className: `${baseClass}__option-input`, id: `${baseClass}__option-input-${checkBoxId}`, onChange: () => setAutoScroll(!autoScroll), type: "checkbox" }),
            react_1.default.createElement("label", { className: `${baseClass}__option-text`, htmlFor: `${baseClass}__option-input-${checkBoxId}` }, optionText)))));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b1Njcm9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9BdXRvU2Nyb2xsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUNwQyxrREFBMEI7QUFtQjFCOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFHLG1CQUFtQixDQUFDO0FBRXRDOzs7R0FHRztBQUNILE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFO0tBQ1YsUUFBUSxDQUFDLEVBQUUsQ0FBQztLQUNaLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFdEI7O0dBRUc7QUFDSCxrQkFBZSxDQUFDLEVBQ2QsVUFBVSxHQUFHLGVBQWUsRUFBRSxFQUM5QixRQUFRLEVBQ1IsU0FBUyxFQUNULE1BQU0sRUFDTixVQUFVLEdBQUcsYUFBYSxFQUMxQixrQkFBa0IsR0FBRyxLQUFLLEVBQzFCLFVBQVUsR0FBRyxJQUFJLEdBQ1gsRUFBRSxFQUFFO0lBQ1YsTUFBTSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsR0FBRyxlQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELE1BQU0sV0FBVyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQWlCLElBQUksQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sR0FBRyxHQUFHLG9CQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtRQUMzQyxDQUFDLEdBQUcsU0FBUyxTQUFTLENBQUMsRUFBRSxlQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzdELENBQUMsR0FBRyxTQUFTLHVCQUF1QixDQUFDLEVBQUUsa0JBQWtCO1FBQ3pELENBQUMsR0FBRyxTQUFTLGNBQWMsQ0FBQyxFQUFFLFVBQVU7S0FDekMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxLQUFLLEdBQUc7UUFDWixNQUFNO1FBQ04sUUFBUSxFQUFFLE1BQU07UUFDaEIsY0FBYyxFQUFFLE1BQU07UUFDdEIsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU07S0FDM0MsQ0FBQztJQUVYLG9EQUFvRDtJQUNwRCxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7UUFDbkIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUVoQyxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUU7WUFDekIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbEY7SUFDSCxDQUFDLENBQUM7SUFFRiw2REFBNkQ7SUFDN0Qsb0VBQW9FO0lBQ3BFLGVBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ25CLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVyxDQUFDO1lBRWhDLElBQUksT0FBTyxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQzthQUN6QztRQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFbEIsc0RBQXNEO0lBQ3RELGlCQUFpQjtJQUNqQixlQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNuQixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUVoQyxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztTQUMxQztJQUNILENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUV4QyxPQUFPLENBQ0wsdUNBQUssU0FBUyxFQUFFLEdBQUc7UUFDakIsdUNBQ0UsU0FBUyxFQUFFLEdBQUcsU0FBUyxvQkFBb0IsRUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFDaEIsR0FBRyxFQUFFLFdBQVcsRUFDaEIsS0FBSyxFQUFFLEtBQUssSUFFWCxRQUFRLENBQ0w7UUFFTCxVQUFVLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUNwQyx1Q0FBSyxTQUFTLEVBQUUsR0FBRyxTQUFTLFVBQVU7WUFDcEMseUNBQ0UsT0FBTyxFQUFFLFVBQVUsRUFDbkIsU0FBUyxFQUFFLEdBQUcsU0FBUyxnQkFBZ0IsRUFDdkMsRUFBRSxFQUFFLEdBQUcsU0FBUyxrQkFBa0IsVUFBVSxFQUFFLEVBQzlDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFDMUMsSUFBSSxFQUFDLFVBQVUsR0FDZjtZQUVGLHlDQUNFLFNBQVMsRUFBRSxHQUFHLFNBQVMsZUFBZSxFQUN0QyxPQUFPLEVBQUUsR0FBRyxTQUFTLGtCQUFrQixVQUFVLEVBQUUsSUFFbEQsVUFBVSxDQUNMLENBQ0osQ0FDUCxDQUNHLENBQ1AsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9