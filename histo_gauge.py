from kivy.uix.boxlayout import BoxLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.graphics import Color, Line, Ellipse, Rectangle
from kivy.clock import Clock
from kivy.uix.widget import Widget
from collections import deque
import time
from kivy.properties import NumericProperty, StringProperty, BooleanProperty, ListProperty, ReferenceListProperty

from kivymd.uix import floatlayout
from collections import deque
from kivy.graphics import InstructionGroup

class HistoGaugeGroup(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    start_threshold = NumericProperty(80)  # Start threshold for highlighting
    end_threshold = NumericProperty(90)    # End threshold for highlighting
    highlight_color = ListProperty([1, 0, 0, 0.3])  # RGBA for highlight color
    value = NumericProperty(0)
    highlight_start = None  # Timestamp when highlighting starts
    highlight_end = None  # Timestamp when highlighting ends
    start_histoplot = NumericProperty(60)  # Minimum x-coordinate for highlighting
    end_histoplot = NumericProperty(360)  # Maximum x-coordinate for highlighting
    time_window = NumericProperty(30)  # Time window for highlighting
    highlight_sections = deque() # List to hold start and end timestamps for each highlight section
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        Clock.schedule_interval(self.check_thresholds, 0.7)  # Check every second
        # self.bind(minimum_height=self.setter('height'))  # Adjust height based on children
    #     self.bind(value=self.on_value)
        
    # def on_value(self, instance, value):
    #     # print(self.value)
    #     self.value = value
    
    
    def check_thresholds(self, dt):
        current_time = time.time()

        if self.value >= self.start_threshold:
            if not self.highlight_sections or (self.highlight_sections and self.highlight_sections[-1].get('end') is not None):
                # Start a new highlight section
                self.highlight_sections.append({'start': current_time})
        elif self.value < self.end_threshold and self.highlight_sections:
            # End the current highlight section
            if self.highlight_sections[-1].get('end') is None:
                self.highlight_sections[-1]['end'] = current_time

        self.update_highlight_sections(current_time)

    def update_highlight_sections(self, current_time):
        # New deque to store updated highlight sections
        new_highlight_sections = deque()

        for section in self.highlight_sections:
            # Skip outdated sections
            if section.get('end') and current_time - section.get('end') >= self.time_window:
                continue

            # Adjust start if it's out of the time window
            if current_time - section['start'] > self.time_window:
                section['start'] = current_time - self.time_window

            # Calculate and update the start and end positions
            start_x = self.children[0].normalize_x(section['start'])
            end_x = self.children[0].normalize_x(section.get('end', current_time))

            section['start_x'] = start_x if start_x is not None else 0
            section['end_x'] = end_x if end_x is not None else self.width

            # Add updated section to the new deque
            new_highlight_sections.append(section)

        # Replace the old deque with the new one
        self.highlight_sections = new_highlight_sections

        # Draw the updated highlights
        self.draw_all_highlights()

    def draw_all_highlights(self):
        if not hasattr(self, 'highlight_instructions'):
            self.highlight_instructions = InstructionGroup()
            self.canvas.before.add(self.highlight_instructions)
        else:
            self.highlight_instructions.clear()

        for section in self.highlight_sections:
            if section['start_x'] is not None and section['end_x'] is not None:
                self.highlight_instructions.add(Color(*self.highlight_color))
                self.highlight_instructions.add(Rectangle(pos=(section['start_x'], self.y), size=(section['end_x'] - section['start_x'], self.height)))

    def remove_highlight(self):
        self.canvas.before.clear()
class DataBox(BoxLayout):
    current_value = NumericProperty(15)  # Example current value
    font_name = StringProperty()
    highest_value = NumericProperty(0)  # New property for highest value
    lowest_value = NumericProperty(100)  # New property for lowest value
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        self.orientation = 'vertical'

        # Create labels
        self.value_label = Label(text=str(self.current_value), size_hint_y=None, height=60, font_size=32)  # Larger font size


        # Value label (to the right of the sublabels)
        value_box = BoxLayout(orientation='horizontal')
        # value_box.add_widget(Label())  # Empty label for spacing
        value_box.add_widget(self.value_label)
        self.add_widget(value_box)
        # New labels for highest and lowest values
        # self.highest_label = Label(text=str(self.highest_value), color=[0, 1, 0, 1])  # Green color for highest
        # self.lowest_label = Label(text=str(self.lowest_value), color=[1, 0, 0, 1])  # Red color for lowest
        # self.add_widget(self.highest_label)
        # self.add_widget(self.lowest_label)

        # New method bindings
        self.bind(highest_value=self.update_highest_label)
        self.bind(lowest_value=self.update_lowest_label)
        # Bind properties to update labels
        self.bind(current_value=self.update_value_label)
        self.bind(font_name=self.on_font_name)
        
    def update_highest_label(self, instance, value):
        self.highest_label.text = f"↑ {value}"  # Up arrow for highest

    def update_lowest_label(self, instance, value):
        self.lowest_label.text = f"↓ {value}"  # Down arrow for lowest

    def on_font_name(self, instance, value):
        self.value_label.font_name = value

    def update_value_label(self, instance, value):
        self.value_label.text = str(value)

class MultiLineLabel(BoxLayout):
    chars_per_line = NumericProperty(3)  # Default value
    text = StringProperty('')  # Text property
    font_name = StringProperty()
    font_size = NumericProperty(24)
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.label = Label(bold=True)  # Internal label
        self.add_widget(self.label)
        self.bind(text=self.update_text, chars_per_line=self.update_text)
        self.bind(font_name=self.on_font_name)
        self.bind(font_size=self.on_font_size)
        
    def on_font_size(self, instance, value):
        self.label.font_size = value
    
    def on_font_name(self, instance, value):
        self.label.font_name = value
    def update_text(self, *args):
        formatted_text = self.split_text(self.text, self.chars_per_line)
        self.label.text = formatted_text

    @staticmethod
    def split_text(text, chars_per_line):
        lines = [text[i:i+chars_per_line] for i in range(0, len(text), chars_per_line)]
        return '\n'.join(lines)
    
class HistoGauge(BoxLayout):
    min_value = NumericProperty(0)
    max_value = NumericProperty(100)
    normal_value = NumericProperty()
    time_window = NumericProperty(60)
    value = NumericProperty(0)
    label_text = StringProperty("")
    label_size = NumericProperty(24)
    header_font_name = StringProperty()
    non_header_font_name = StringProperty()
    max_line_pos = NumericProperty(0)
    min_line_pos = NumericProperty(0)
    unit_text = StringProperty("") 
    
    # (value, timestamp)
    highest_value = float('-inf')
    lowest_value = float('inf')
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        

        self.orientation = 'horizontal'  # Assuming a horizontal layout
        self.history_values = deque()
        self.current_value = Label()  # Large text for current value
        
        # Container for histogram and label
        # self.overlay_container = FloatLayout(size_hint_x=1)
        # self.add_widget(self.overlay_container)
        self.label_box = MultiLineLabel(size_hint=(0.3, 1), orientation='vertical')
        self.add_widget(self.label_box)
        # Histogram container (inside overlay container)
        self.histogram_container = BoxLayout(size_hint=(1, 1), pos_hint={'x': 0, 'y': 0})
        self.add_widget(self.histogram_container)

        # Current value label (inside histogram container)
        self.current_value = Label(size_hint_x=1)
        self.histogram_container.add_widget(self.current_value)

        # # Overlay label (on top of the histogram)
        # self.overlay_label = Label(size_hint=(None, 0.4),
        #                            text=self.label_text, font_size=18,
        #                            halign='left', valign='middle',
        #                            pos_hint={'x': 0.01, 'top': .96})  # Adjust pos_hint as needed
        # self.overlay_container.add_widget(self.overlay_label)

   

        # Current value label
        self.current_value = Label(size_hint_x=1)
        # self.histogram_container.add_widget(self.current_value)

        self.histogram_instructions = InstructionGroup()
        self.histogram_container.canvas.add(self.histogram_instructions)

        # Create a BoxLayout for labels
        self.labels_layout = BoxLayout(orientation='vertical', size_hint=(None, 1))
        self.labels_layout.width = 20  # Set a fixed width for labels
        self.add_widget(self.labels_layout)

        # Create min and max labels
        self.min_label = Label(size_hint_y=None, height=24, text = str(self.min_value), font_size=10, color=[1, 1, 1, 0.6])
        self.max_label = Label(size_hint_y=None, height=24, text = str(self.max_value), font_size=10, color=[1, 1, 1, 0.6])
        self.mid_unit_label = Label(size_hint_y=None, height=24, text = str(self.unit_text), font_size=12,color=[1, 1, 1, 0.6])
    
        # Add labels to the labels layout
        self.labels_layout.add_widget(self.max_label)
        self.labels_layout.add_widget(self.mid_unit_label)  # Stretchy widget to push labels to ends
        self.labels_layout.add_widget(self.min_label)
        
        # self.data_box = DataBox(size_hint=(0.1, 1), orientation='vertical',)
        # self.add_widget(self.data_box)
        
        self.highest_lowest_layout = BoxLayout(orientation='vertical', size_hint=(None, 1), width=100)
        # bright yellow
        self.highest_label = Label(size_hint_y=None, height=24, text = str(self.highest_value), font_size=14, color=[1, 1, 0, 1])
        self.lowest_label = Label(size_hint_y=None, height=24, text = str(self.lowest_value), font_size=14, color=[0, 0.7, 1, 1])
        self.current_value_label = Label(size_hint_y=None, height=24, text = str(self.value), font_size=28)

        self.highest_lowest_layout.add_widget(self.highest_label)
        self.highest_lowest_layout.add_widget(self.current_value_label)
        self.highest_lowest_layout.add_widget(self.lowest_label)
        self.add_widget(self.highest_lowest_layout)
        
        Clock.schedule_interval(self.update_histogram, 0.7)
        self.bind(value=self.on_value)
        self.bind(label_text=self.on_label_text)
        self.bind(header_font_name=self.on_header_font_name)
        self.bind(non_header_font_name=self.on_non_header_font_name)
        self.bind(label_size=self.on_label_size)
        self.bind(unit_text=self.on_unit_text)
        self.bind(min_value=self.on_min_value)
        self.bind(max_value=self.on_max_value)
        # self.bind(height=self.on_height)
        
    def on_min_value(self, instance, value):
        self.min_label.text = str(value)
    
    def on_max_value(self, instance, value):
        self.max_label.text = str(value)

    def on_unit_text(self, instance, value):
        self.mid_unit_label.text = value
    def on_label_size(self, instance, value):
        self.label_box.font_size = value
        
    def on_label_text(self, instance, value):
        self.label_box.text = value
        # self.self.label_box.width = len(value) * 14  # Adjust width as needed
    
    def on_header_font_name(self, instance, value):
        self.label_box.font_name = value
        self.current_value.font_name = value
        self.current_value_label.font_name = value
        # self.data_box.font_name = value
    
    def on_non_header_font_name(self, instance, value):
        pass
        # self.min_label.font_name = value
        # self.max_label.font_name = value
        # self.highest_label.font_name = value
        # self.lowest_label.font_name = value
    def draw_separation_line(self, y_pos, label_type):
        if label_type == 'max':
            self.histogram_instructions.add(Color(1, 0.5, 0.1, 0.8))  # Example: orange color
            self.histogram_instructions.add(Line(points=[self.histogram_container.x, y_pos, self.histogram_container.x + self.histogram_container.width, y_pos], width=1))

        else:
            self.histogram_instructions.add(Color(1, 1, 1, 0.35))  # Example: white color with more transparency
            self.histogram_instructions.add(Line(points=[self.histogram_container.x - 70, y_pos, self.histogram_container.x + self.histogram_container.width, y_pos], width=1))

        # # Move the corresponding label
        # if label_type == 'max':
        #     self.max_label.y = y_pos - self.max_label.height / 2
        # elif label_type == 'min':
        #     self.min_label.y = y_pos - self.min_label.height / 2


    def on_size(self, instance, value):
        self.draw_separation_line(self.y + self.height, "max")  # Top line
        self.draw_separation_line(self.y, "min")
        # self.data_box.height = self.heightT
        self.label_box.height = self.height

    def on_value(self, instance, value):
        self.current_value.text = str(value)  # Update text in real-time
        self.current_value_label.text = str(value)
        
    def update_histogram(self, dt):
        current_time = time.time()

        # Add latest value to history for histogram
        if self.current_value.text:
            self.history_values.append((float(self.current_value.text), current_time))

        # Remove outdated values
        while self.history_values and current_time - self.history_values[0][1] > self.time_window:
            self.history_values.popleft()
            break

        self.draw_histogram()


    def draw_histogram(self):
        self.histogram_instructions.clear()
        self.min_label.y = self.normalize_y(self.min_value) - 12
        self.max_label.y = self.normalize_y(self.max_value) - 12
            
        self.highest_label.y = self.normalize_y(self.max_value) - 12
        self.lowest_label.y = self.normalize_y(self.min_value) - 12
        # Draw separation lines
        self.draw_separation_line(self.top, "max")
        self.draw_separation_line(self.y, "min")

        # Set the color for the histogram dots/lines
        self.histogram_instructions.add(Color(1, 1, 1, 0.8))  # Example: white color with some transparency

        # Iterate over the history values and draw each point
        for value, timestamp in self.history_values:
            x_pos = self.normalize_x(timestamp)
            y_pos = self.normalize_y(value)
            self.draw_data_point(x_pos, y_pos, value > self.max_value - (self.max_value - self.min_value) * 0.1)

        # Optionally, draw the normal line
        if self.normal_value:
            self.draw_normal_line()
        if self.history_values:
            self.highest_value = max(self.history_values)[0]
            self.lowest_value = min(self.history_values)[0]
            self.highest_label.text = f"{self.highest_value}"  # Up arrow for highest
            self.lowest_label.text = f"{self.lowest_value}"  # Down arrow for lowest
            if self.highest_value >= self.max_value:
                # brighter orange
                
                self.highest_label.color = [1, 0.5,0.1,1]
            else:
                self.highest_label.color = [1, 1, 0, 1]

                
    def normalize_x(self, timestamp):
        """ Normalize the x position based on the timestamp. """
        current_time = time.time()
        time_diff = current_time - timestamp
        x_pos = (self.histogram_container.width - (time_diff / self.time_window) * self.histogram_container.width) + self.histogram_container.x
        return x_pos

    def normalize_y(self, value):
        """ Normalize the y position based on the value. """
        value_range = self.max_value - self.min_value
        y_pos = ((value - self.min_value) / value_range) * self.height + self.y
        return y_pos

    def draw_data_point(self, x_pos, y_pos, is_over_limit=False):
        """ Draw a single data point at the given x and y positions. """
        dot_size = 3  # Size of the dot

        if is_over_limit:
            # Orange color for over limit
            self.histogram_instructions.add(Color(1, 0.5, 0.1, 0.8))
        # else:
        #     # Default color for normal points
        #     self.histogram_instructions.add(Color(1, 1, 1, 0.8))  # Green color

        self.histogram_instructions.add(Ellipse(pos=(x_pos - dot_size / 2, y_pos - dot_size / 2), size=(dot_size, dot_size)))

    def draw_normal_line(self):
        """ Draw a line indicating the normal value. """
        normal_y = self.normalize_y(self.normal_value)
        self.histogram_instructions.add(Line(points=[self.histogram_container.x, normal_y, self.histogram_container.x + self.histogram_container.width, normal_y], dash_offset=5))

    def get_histogram_container_position(self):
        return self.histogram_container.x